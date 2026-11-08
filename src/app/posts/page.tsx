import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import { PostList, TopicChips, topicCounts } from "@/components/PostList";

export const metadata = pageMetadata(
  "글",
  "무언가를 만들며 배운 것, AI와 일하는 법, 쉽게 풀어 쓴 IT 이야기."
);

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Writing</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">글</h1>
      <p className="mt-3 text-muted">
        이 사이트에서 직접 쓰는 글이에요. 만들며 배운 것, AI와 일하는 법, 쉽게 풀어 쓴 IT
        이야기를 모읍니다.
      </p>
      <TopicChips counts={topicCounts(posts)} />
      <PostList posts={posts} />
    </div>
  );
}
