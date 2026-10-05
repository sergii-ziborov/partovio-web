import Link from "next/link";
import { loadPosts } from "../../lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await loadPosts();
  return (
    <main className="wrap">
      <h1>Latest from the blog</h1>
      <p className="muted">Notes on reading offers and on what the catalog does not claim.</p>
      <div className="posts">
        {posts.map((post) => (
          <Link className="card post" key={post.slug} href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
            <p className="muted">{post.date}</p>
            <p>{post.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
