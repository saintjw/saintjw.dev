import { getSearchIndex } from "@/lib/tistory";

// 잡학사전 검색칸이 처음 검색할 때 한 번 불러가는 티스토리 글 전체 색인.
// 정적으로 만들어 두고 1시간마다 다시 만든다(뒤쪽 목록 페이지는 하루 캐시).
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const entries = await getSearchIndex().catch(() => []);
  return Response.json(entries, {
    headers: { "X-Robots-Tag": "noindex" },
  });
}
