import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";

// 이야기방(Q&A) 저장소. 질문은 누구나 남기고, 운영자가 답한 공개 질문만 화면에 나온다.
// 운영 환경에서는 Vercel에 연결한 Upstash Redis를 쓰고, 로컬 개발에서는 메모리에 잠깐 담는다.

export type QnaStatus = "pending" | "answered" | "hidden";

export type Question = {
  id: string;
  nickname: string;
  question: string;
  isPrivate: boolean;
  status: QnaStatus;
  createdAt: string; // ISO
  answer?: string;
  answeredAt?: string; // ISO
  tokenHash: string; // 질문자가 받은 확인 링크 토큰의 해시
};

const HASH_KEY = "qna:questions";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

/** 운영 환경인데 저장소가 연결되지 않았으면 false. 로컬 개발은 메모리 저장소로 동작한다. */
export function isStoreReady(): boolean {
  return redis !== null || process.env.NODE_ENV !== "production";
}

// ── 로컬 개발용 메모리 저장소 ──
type MemoryStore = { questions: Map<string, Question>; keys: Map<string, number> };
const g = globalThis as unknown as { __qnaMemory?: MemoryStore };
const memory: MemoryStore = (g.__qnaMemory ??= { questions: new Map(), keys: new Map() });

async function saveQuestion(q: Question) {
  if (redis) await redis.hset(HASH_KEY, { [q.id]: JSON.stringify(q) });
  else memory.questions.set(q.id, q);
}

function parse(raw: unknown): Question | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Question;
  try {
    return JSON.parse(String(raw)) as Question;
  } catch {
    return null;
  }
}

export async function getQuestion(id: string): Promise<Question | null> {
  if (!/^[a-z0-9]{6,32}$/.test(id)) return null;
  if (redis) return parse(await redis.hget(HASH_KEY, id));
  return memory.questions.get(id) ?? null;
}

export async function listQuestions(): Promise<Question[]> {
  let all: Question[];
  if (redis) {
    const raw = (await redis.hgetall<Record<string, unknown>>(HASH_KEY)) ?? {};
    all = Object.values(raw).map(parse).filter((q): q is Question => q !== null);
  } else {
    all = [...memory.questions.values()];
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 화면에 공개되는 질문: 답변이 달렸고 비공개가 아닌 것. 최근 답변 순. */
export async function listPublicQuestions(): Promise<Question[]> {
  const all = await listQuestions();
  return all
    .filter((q) => q.status === "answered" && !q.isPrivate)
    .sort((a, b) => (b.answeredAt ?? "").localeCompare(a.answeredAt ?? ""));
}

export function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function createQuestion(input: {
  nickname: string;
  question: string;
  isPrivate: boolean;
}): Promise<{ id: string; token: string }> {
  const id = Date.now().toString(36) + randomBytes(4).toString("hex");
  const secret = randomBytes(16).toString("hex");
  await saveQuestion({
    id,
    nickname: input.nickname,
    question: input.question,
    isPrivate: input.isPrivate,
    status: "pending",
    createdAt: new Date().toISOString(),
    tokenHash: hashToken(secret),
  });
  return { id, token: secret };
}

export async function answerQuestion(id: string, answer: string) {
  const q = await getQuestion(id);
  if (!q) return;
  await saveQuestion({
    ...q,
    answer,
    status: "answered",
    answeredAt: q.answeredAt ?? new Date().toISOString(),
  });
}

export async function setQuestionStatus(id: string, status: QnaStatus) {
  const q = await getQuestion(id);
  if (!q) return;
  await saveQuestion({ ...q, status });
}

export async function deleteQuestion(id: string) {
  if (redis) await redis.hdel(HASH_KEY, id);
  else memory.questions.delete(id);
}

/** 확인 링크 토큰이 맞는지 본다. */
export function tokenMatches(q: Question, value: string | undefined): boolean {
  if (!value) return false;
  const a = Buffer.from(hashToken(value));
  const b = Buffer.from(q.tokenHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── 횟수 제한: key마다 windowSec 동안 limit번까지 ──
export async function hitLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const full = `qna:rl:${key}`;
  if (redis) {
    const count = await redis.incr(full);
    if (count === 1) await redis.expire(full, windowSec);
    return count > limit;
  }
  const now = Date.now();
  const k = `${full}:${Math.floor(now / (windowSec * 1000))}`;
  const count = (memory.keys.get(k) ?? 0) + 1;
  memory.keys.set(k, count);
  return count > limit;
}

/** IP를 그대로 저장하지 않도록 해시로 바꿔 횟수 제한 키로만 쓴다. */
export function clientKey(ip: string): string {
  return createHash("sha256").update(`qna:${ip}`).digest("hex").slice(0, 24);
}

// ── 관리자 인증 ──
const ADMIN_COOKIE = "qna_admin";
export { ADMIN_COOKIE };

export function adminConfigured(): boolean {
  return Boolean(process.env.QNA_ADMIN_PASSWORD) || process.env.NODE_ENV !== "production";
}

function adminPassword(): string {
  // 로컬 개발에서 비밀번호를 정하지 않았으면 "dev"로 들어간다.
  return process.env.QNA_ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "dev" : "");
}

/** 쿠키에 담는 값: 비밀번호에서 만든 서명. 비밀번호를 바꾸면 기존 로그인이 모두 풀린다. */
export function adminSessionValue(): string {
  const pw = adminPassword();
  return createHmac("sha256", pw).update("qna-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(input: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(hashToken(input), hashToken(pw));
}

export function isAdminSession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !adminPassword()) return false;
  return safeEqual(cookieValue, adminSessionValue());
}

/** ISO 시각을 한국 날짜(YYYY-MM-DD)로. 날짜 도장에 쓴다. */
export function kstDate(iso: string): string {
  return new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
