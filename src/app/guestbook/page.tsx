import Giscus from "@/components/Giscus";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";

export const metadata = pageMetadata(
  "방명록",
  "GitHub 계정으로 로그인하고 방명록을 남겨보세요.",
);

export default function GuestbookPage() {
  return (
    <DiaryPage
      color="yellow"
      title="방명록"
      intro={
        <p>
          다녀가셨다면 한 줄 남겨 주세요. GitHub 계정으로 로그인하면 댓글을 쓸
          수 있어요.
        </p>
      }
    >
      <div className="mt-10 border-t border-dashed border-rule pt-8">
        <Giscus />
      </div>
    </DiaryPage>
  );
}
