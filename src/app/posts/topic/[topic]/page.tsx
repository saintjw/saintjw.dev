import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import { getTopic, topics } from "@/lib/topics";
import { pageMetadata } from "@/lib/metadata";
import { PostList, PostsSheet, topicCounts } from "@/components/PostList";

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/posts/topic/[topic]">) {
  const topic = getTopic((await params).topic);
  return topic ? pageMetadata(topic.name, topic.description) : {};
}

export default async function TopicPage({ params }: PageProps<"/posts/topic/[topic]">) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();
  const all = getAllPosts();

  return (
    <PostsSheet active={topic.slug} counts={topicCounts(all)} title={topic.name} intro={topic.description}>
      <PostList posts={all.filter((p) => p.topic === topic.slug)} />
    </PostsSheet>
  );
}
