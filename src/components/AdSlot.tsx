// 애드센스 광고 자리. 승인 전에는 아무것도 그리지 않아 본문에 빈 구멍이 생기지 않는다.
// 승인 후 NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)와 슬롯 ID를 넣으면
// 본문 기둥 폭에 맞춘 자리가 점선 사이에 열린다. 광고 스크립트(adsbygoogle.js)는 그때 layout에 추가한다.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSlot({
  slot,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  if (!CLIENT || !slot) return null;
  return (
    <aside
      aria-label="광고"
      className={`my-10 border-y border-dashed border-rule py-6 ${className}`}
    >
      <ins
        className="adsbygoogle block min-h-[250px] w-full"
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
