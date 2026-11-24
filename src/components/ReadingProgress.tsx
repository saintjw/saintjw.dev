"use client";

import { useEffect, useRef } from "react";

/**
 * 글을 읽은 만큼 화면 맨 위에 형광펜 줄이 그어진다.
 * 스크롤마다 리렌더하지 않도록 DOM의 scaleX만 바꾼다.
 */
export default function ReadingProgress({ color }: { color: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={bar}
        className="h-full origin-left"
        style={{ background: color, transform: "scaleX(0)" }}
      />
    </div>
  );
}
