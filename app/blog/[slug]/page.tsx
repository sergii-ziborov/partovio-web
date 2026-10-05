import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPosts } from "../../../lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await loadPosts()).find((item) => item.slug === slug);
  return { title: post?.title || "Blog" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await loadPosts()).find((item) => item.slug === slug);
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
