import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { getBlogPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description: "Guides, market notes and advice on buying, selling and letting in London.",
};

export default async function InsightsPage() {
  const posts = await getBlogPosts();
  return (
    <Container className="py-14">
      <Eyebrow className="mb-3">Insights</Eyebrow>
      <h1 className="max-w-2xl font-display text-4xl text-ink sm:text-5xl">Notes on the London market</h1>
      <p className="mt-4 max-w-xl text-muted">Practical guides and considered advice for buyers, sellers and landlords.</p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/insights/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
              {post.coverImage && <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
            </div>
            <div className="mt-4 flex flex-1 flex-col">
              <p className="text-[0.72rem] uppercase tracking-[0.1em] text-muted">{formatDate(post.publishedAt)} · {post.author}</p>
              <h2 className="mt-2 font-display text-2xl leading-snug text-ink">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-muted">{post.excerpt}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted">No articles yet.</p>}
      </div>
    </Container>
  );
}
