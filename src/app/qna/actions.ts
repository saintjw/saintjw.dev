"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  adminSessionValue,
  answerQuestion,
  clientKey,
  createQuestion,
  deleteQuestion,
  hitLimit,
  isAdminSession,
  isStoreReady,
  passwordMatches,
  setQuestionStatus,
} from "@/lib/qna";

export type AskState =
  | { ok: true; id: string; token: string; isPrivate: boolean }
  | { ok: false; error: string }
  | null;

// 보이지 않는 제어 문자를 지우고 앞뒤 공백을 정리한다.
function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮]/g, "")
    .trim()
    .slice(0, max);
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // 키를 아직 연결하지 않았으면 다른 장치(숨은 칸, 횟수 제한)만 쓴다.
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function askQuestion(_prev: AskState, formData: FormData): Promise<AskState> {
  if (!isStoreReady()) {
    return { ok: false, error: "이야기방을 준비하고 있어요. 잠시 뒤에 다시 남겨 주세요." };
  }

  // 사람에게는 보이지 않는 칸. 채워져 있으면 봇이다.
  if (clean(formData.get("website"), 200)) {
    return { ok: false, error: "질문을 보내지 못했어요. 다시 시도해 주세요." };
  }

  const nickname = clean(formData.get("nickname"), 20) || "익명의 방문자";
  const question = clean(formData.get("question"), 1000);
  const isPrivate = formData.get("private") === "on";

  if (question.length < 5) {
    return { ok: false, error: "질문을 다섯 글자 이상 적어 주세요." };
  }
  if ((question.match(/https?:\/\//gi) ?? []).length > 2) {
    return { ok: false, error: "링크는 두 개까지만 넣을 수 있어요." };
  }

  const ip = await clientIp();
  const key = clientKey(ip);
  if (await hitLimit(`ask:${key}`, 3, 10 * 60)) {
    return { ok: false, error: "질문을 너무 자주 보냈어요. 10분쯤 뒤에 다시 남겨 주세요." };
  }

  const human = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip);
  if (!human) {
    return { ok: false, error: "자동 입력 방지 확인에 실패했어요. 다시 시도해 주세요." };
  }

  const { id, token } = await createQuestion({ nickname, question, isPrivate });
  revalidatePath("/qna/admin");
  return { ok: true, id, token, isPrivate };
}

// ── 관리자 ──

async function requireAdmin() {
  const store = await cookies();
  if (!isAdminSession(store.get(ADMIN_COOKIE)?.value)) {
    throw new Error("Unauthorized");
  }
}

export type LoginState = { error: string } | null;

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = clientKey(await clientIp());
  if (await hitLimit(`login:${key}`, 5, 15 * 60)) {
    return { error: "시도가 너무 많아요. 15분 뒤에 다시 해 주세요." };
  }
  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    return { error: "비밀번호가 맞지 않아요." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/qna",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/qna/admin");
}

export async function adminLogout() {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/qna" });
  redirect("/qna/admin");
}

function refresh(id: string) {
  revalidatePath("/qna");
  revalidatePath("/qna/admin");
  revalidatePath(`/qna/${id}`);
}

export async function saveAnswer(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const answer = String(formData.get("answer") ?? "").trim().slice(0, 4000);
  if (!id || !answer) return;
  await answerQuestion(id, answer);
  refresh(id);
}

export async function hideQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await setQuestionStatus(id, "hidden");
  refresh(id);
}

export async function restoreQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const answered = formData.get("answered") === "1";
  await setQuestionStatus(id, answered ? "answered" : "pending");
  refresh(id);
}

export async function removeQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await deleteQuestion(id);
  refresh(id);
}
