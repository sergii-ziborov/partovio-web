import Link from "next/link";
import { notFound } from "next/navigation";
import { findPost, posts } from "../../../lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = findPost((await params).slug);
  return { title: post?.title || "Blog" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = findPost((await params).slug);
  if (!post) notFound();
  return (
    <main className="wrap article">
      <p className="crumbs"><Link href="/blog">Blog</Link> / {post.title}</p>
      <h1>{post.title}</h1>
      <p className="muted">{post.date}</p>
      {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </main>
  );
}
