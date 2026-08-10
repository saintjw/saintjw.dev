"use client";

import { useState } from "react";

export default function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  }

  return (
    <button
      onClick={handleShare}
      className={
        className ??
        "rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
      }
    >
      {copied ? "링크가 복사되었어요 ✓" : "공유하기 🔗"}
    </button>
  );
}
