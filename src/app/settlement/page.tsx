import Settlement from "@/components/Settlement";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata("대회 정산", "참석 명단과 수입·지출을 넣으면 1/n로 정산해주는 계산기."),
  // 홈 화면에 앱처럼 설치할 수 있게 하는 설정
  manifest: "/settlement.webmanifest",
};

export default function SettlementPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">대회 정산</h1>
      <p className="mt-2 text-muted">
        참석 명단과 수입·지출 내역을 넣으면 1인당 정산 금액을 계산해요. 입력한 내용은 이
        기기에만 저장됩니다.
      </p>

      <div className="mt-8 sm:mt-12">
        <Settlement />
      </div>
    </div>
  );
}
