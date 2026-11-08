import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import { getTopic, topics } from "@/lib/topics";
import { pageMetadata } from "@/lib/metadata";
import { PostList, TopicChips, topicCounts } from "@/components/PostList";

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Writing</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {topic.name}
      </h1>
      <p className="mt-3 text-muted">{topic.description}</p>
      <TopicChips active={topic.slug} counts={topicCounts(all)} />
      <PostList posts={all.filter((p) => p.topic === topic.slug)} />
    </div>
  );
}
