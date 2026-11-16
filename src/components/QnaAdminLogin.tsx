"use client";

import { useActionState } from "react";
import { adminLogin, type LoginState } from "@/app/qna/actions";

export default function QnaAdminLogin() {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLogin, null);
  return (
    <form action={action} className="mt-10 flex max-w-sm flex-col gap-3">
      <label htmlFor="qna-pw" className="text-sm font-semibold text-foreground">
        관리 비밀번호
      </label>
      <input
        id="qna-pw"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-foreground/40 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full border border-foreground/25 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-accent-soft disabled:opacity-50"
      >
        {pending ? "확인 중…" : "들어가기"}
      </button>
      {state?.error && <p className="text-sm text-foreground">{state.error}</p>}
    </form>
  );
}
