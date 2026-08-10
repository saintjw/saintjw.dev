import Giscus from "@/components/Giscus";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "방명록",
  "GitHub 계정으로 로그인하고 방명록을 남겨보세요."
);

export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">방명록</h1>
      <p className="mt-3 text-muted">
        GitHub 계정으로 로그인하면 댓글을 남길 수 있어요.
      </p>

      <div className="mt-10">
        <Giscus />
      </div>
    </div>
  );
}
