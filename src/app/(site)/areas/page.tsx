import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { getAreaGuides } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Area guides",
  description: "Local area guides to the London neighbourhoods where NARA sources property opportunities.",
};

export default async function AreasPage() {
  const guides = await getAreaGuides();
  return (
    <Container className="py-14">
      <Eyebrow className="mb-3">Area guides</Eyebrow>
      <h1 className="max-w-2xl font-display text-4xl text-ink sm:text-5xl">The neighbourhoods we know best</h1>
      <p className="mt-4 max-w-xl text-muted">
        Honest local knowledge on the areas where we work — transport, character and the things that make each one worth living in.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link key={g.slug} href={`/areas/${g.slug}`} className="group">
            <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
              {g.heroImage && <Image src={g.heroImage} alt={g.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
            </div>
            <h2 className="mt-4 font-display text-2xl text-ink">{g.location?.name ?? g.title}</h2>
            <p className="mt-1 line-clamp-2 text-[0.9rem] text-muted">{g.intro}</p>
          </Link>
        ))}
        {guides.length === 0 && <p className="text-muted">No area guides yet.</p>}
      </div>
    </Container>
  );
}
