"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/adsense";

// 애드센스 광고 자리. 슬롯 ID가 없으면 아무것도 그리지 않아 본문에 빈 구멍이 생기지 않는다.
// 승인 후 광고 단위를 만들고 NEXT_PUBLIC_ADSENSE_SLOT_TOP/BOTTOM에 슬롯 ID를 넣으면 열린다.
// 광고 스크립트(adsbygoogle.js)는 layout에서 모든 페이지에 한 번 불러온다.
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slot,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  useEffect(() => {
    if (!slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  if (!slot) return null;
  return (
    <aside
      aria-label="광고"
      className={`my-10 border-y border-dashed border-rule py-6 ${className}`}
    >
      <ins
        className="adsbygoogle block min-h-[250px] w-full"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
