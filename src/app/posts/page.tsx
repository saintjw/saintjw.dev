import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import { PostList, PostsSheet, topicCounts } from "@/components/PostList";

export const metadata = pageMetadata(
  "글",
  "무언가를 만들며 배운 것, AI와 일하는 법, 쉽게 풀어 쓴 IT 이야기."
);

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <PostsSheet
      counts={topicCounts(posts)}
      title="글"
      intro="이 사이트에서 직접 쓰는 글이에요. 만들며 배운 것, AI와 일하는 법, 쉽게 풀어 쓴 IT 이야기를 날짜별로 끼워 둡니다."
    >
      <PostList posts={posts} />
    </PostsSheet>
  );
}
