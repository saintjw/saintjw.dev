"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { askQuestion, type AskState } from "@/app/qna/actions";

// 이야기방 질문 쓰기. 로그인 없이 닉네임과 질문만 받는다.
// 봇 차단: Cloudflare Turnstile(키가 있을 때) + 보이지 않는 칸 + 서버의 횟수 제한.

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted/70 focus:border-foreground/40 focus:outline-none";

export default function QnaForm() {
  const [state, action, pending] = useActionState<AskState, FormData>(askQuestion, null);
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (!SITE_KEY || !scriptReady || !widgetRef.current || widgetId.current) return;
    widgetId.current =
      window.turnstile?.render(widgetRef.current, { sitekey: SITE_KEY, language: "ko" }) ?? null;
  }, [scriptReady]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      formRef.current?.reset();
      setLength(0);
    }
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [state]);

  const checkUrl = state?.ok ? `/qna/${state.id}?k=${state.token}` : "";

  return (
    <div>
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}

      <form ref={formRef} action={action} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-center">
          <label htmlFor="qna-nickname" className="text-sm font-semibold text-foreground">
            닉네임 <span className="font-normal text-muted">(안 적으면 익명)</span>
          </label>
          <input
            id="qna-nickname"
            name="nickname"
            maxLength={20}
            autoComplete="nickname"
            placeholder="예: 지나가던 개발자"
            className={field}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="qna-question" className="text-sm font-semibold text-foreground">
            질문
          </label>
          <textarea
            id="qna-question"
            name="question"
            required
            minLength={5}
            maxLength={1000}
            rows={5}
            onChange={(e) => setLength(e.target.value.length)}
            placeholder="글에 대한 질문, 사이트 이야기, 궁금한 무엇이든 남겨 주세요."
            className={`${field} resize-y leading-relaxed`}
          />
          <p className="text-right text-xs tabular-nums text-muted">{length} / 1000</p>
        </div>

        {/* 사람에게는 보이지 않는 칸 (봇 차단용) */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            웹사이트
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="private" className="h-4 w-4 accent-[var(--tab-leaf)]" />
          비공개로 질문하기 <span className="text-xs">(답변은 확인 링크로만 볼 수 있어요)</span>
        </label>

        {SITE_KEY && <div ref={widgetRef} className="min-h-[65px]" />}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-foreground/25 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-accent-soft disabled:opacity-50"
          >
            {pending ? "보내는 중…" : "질문 남기기"}
          </button>
          <p className="text-xs text-muted">답변이 달린 공개 질문만 이 페이지에 올라와요.</p>
        </div>

        <div aria-live="polite">
          {state && !state.ok && (
            <p className="rounded-xl bg-pink px-4 py-3 text-sm text-foreground">{state.error}</p>
          )}
          {state?.ok && (
            <div className="rounded-xl bg-mint px-4 py-4 text-sm leading-relaxed text-foreground">
              <p className="font-semibold">질문이 잘 도착했어요. 고마워요!</p>
              <p className="mt-1">
                답변이 달리면 {state.isPrivate ? "아래 링크에서만" : "이 페이지와 아래 링크에서"} 볼 수
                있어요. 링크는 다시 보여 드릴 수 없으니 꼭 저장해 두세요.
              </p>
              <Link href={checkUrl} className="marker-link mt-2 inline-block break-all font-semibold">
                내 질문 확인하기 →
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
