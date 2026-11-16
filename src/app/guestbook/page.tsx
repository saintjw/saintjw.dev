import Link from "next/link";
import Giscus from "@/components/Giscus";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";

export const metadata = pageMetadata(
  "지난 방명록",
  "GitHub 계정으로 남겨 주신 예전 방명록입니다. 새 이야기는 이야기방(Q&A)에 남겨 주세요.",
);

export default function GuestbookPage() {
  return (
    <DiaryPage
      color="yellow"
      title="지난 방명록"
      intro={
        <p>
          GitHub로 남겨 주신 예전 방명록이에요. 이제는 로그인 없이{" "}
          <Link href="/qna" className="marker-link text-foreground">
            이야기방(Q&amp;A)
          </Link>
          에 편하게 남겨 주세요.
        </p>
      }
    >
      <div className="mt-10 border-t border-dashed border-rule pt-8">
        <Giscus />
      </div>
    </DiaryPage>
  );
}
