import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/property-grid";
import { getAreaGuideBySlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAreaGuideBySlug(slug);
  if (!data) return { title: "Area guide not found" };
  return {
    title: data.guide.title,
    description: data.guide.intro,
    alternates: { canonical: absoluteUrl(`/areas/${slug}`) },
    openGraph: { title: data.guide.title, description: data.guide.intro, images: data.guide.heroImage ? [data.guide.heroImage] : [] },
  };
}

export default async function AreaGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAreaGuideBySlug(slug);
  if (!data) notFound();
  const { guide, properties } = data;

  return (
    <div>
      <div className="relative min-h-[360px] overflow-hidden">
        {guide.heroImage && <Image src={guide.heroImage} alt={guide.title} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/30" />
        <Container className="relative flex min-h-[360px] flex-col justify-end pb-10 pt-28">
          <Eyebrow className="mb-2 text-accent-soft">Area guide</Eyebrow>
          <h1 className="font-display text-4xl text-white sm:text-5xl">{guide.title}</h1>
        </Container>
      </div>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <article className="prose-nara max-w-none">
          <p className="text-xl leading-relaxed text-ink">{guide.intro}</p>
          {guide.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
        <aside className="space-y-6">
          {guide.transport.length > 0 && (
            <div className="border border-line bg-white p-6">
              <h3 className="mb-3 font-display text-lg text-ink">Transport</h3>
              <ul className="space-y-2 text-[0.88rem] text-ink-2">
                {guide.transport.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          )}
          {guide.highlights.length > 0 && (
            <div className="border border-line bg-surface p-6">
              <h3 className="mb-3 font-display text-lg text-ink">Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {guide.highlights.map((h) => <span key={h} className="border border-line bg-white px-3 py-1.5 text-[0.82rem] text-ink-2">{h}</span>)}
              </div>
            </div>
          )}
        </aside>
      </Container>

      {properties.length > 0 && (
        <Section surface>
          <Container>
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl">Property in {guide.location?.name ?? "this area"}</h2>
              {guide.location && <ButtonLink href={`/properties?location=${guide.location.slug}`} variant="outline" size="sm">View all</ButtonLink>}
            </div>
            <PropertyGrid properties={properties} />
          </Container>
        </Section>
      )}
    </div>
  );
}
