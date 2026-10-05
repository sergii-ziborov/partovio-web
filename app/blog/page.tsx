import Link from "next/link";
import { posts } from "../../lib/posts";

export const metadata = { title: "Blog" };

export default function BlogPage() {
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
