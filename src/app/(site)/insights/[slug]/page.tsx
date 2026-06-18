import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getBlogPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: absoluteUrl(`/insights/${slug}`) },
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <Container className="max-w-3xl py-12">
        <Link href="/insights" className="text-[0.75rem] uppercase tracking-[0.1em] text-accent">← All insights</Link>
        <p className="mt-6 text-[0.74rem] uppercase tracking-[0.1em] text-muted">{formatDate(post.publishedAt)} · {post.author}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-xl leading-relaxed text-muted">{post.excerpt}</p>
      </Container>

      {post.coverImage && (
        <Container className="max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width:1024px) 100vw, 900px" className="object-cover" />
          </div>
        </Container>
      )}

      <Container className="max-w-3xl py-12">
        <div className="prose-nara">
          {post.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
            {post.tags.map((t) => <span key={t} className="border border-line bg-surface px-3 py-1.5 text-[0.8rem] text-ink-2">{t}</span>)}
          </div>
        )}
      </Container>
    </article>
  );
}
