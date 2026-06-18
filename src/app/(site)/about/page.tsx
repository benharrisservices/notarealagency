import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About us",
  description: "NARA is a London property platform built on curation, earlier access and a sharper view of value.",
};

export default async function AboutPage() {
  const agents = await prisma.agent.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div>
      <div className="relative min-h-[380px] overflow-hidden">
        <Image src="/properties/cable-street-e1/01-reception.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-ink/40" />
        <Container className="relative flex min-h-[380px] flex-col justify-end pb-12 pt-28">
          <Eyebrow className="mb-3 text-accent-soft">About NARA</Eyebrow>
          <h1 className="max-w-2xl font-display text-4xl text-white sm:text-5xl">A London property platform with a point of view</h1>
        </Container>
      </div>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="prose-nara max-w-none">
            <p className="text-xl leading-relaxed text-ink">
              NARA was founded on a simple idea: that buying, selling or letting a home in London should feel
              considered rather than chaotic.
            </p>
            <p>
              We focus on a handful of East and North-East London neighbourhoods we know intimately — from the
              warehouse conversions of Wapping to the period streets of Bethnal Green and the riverside
              of Wapping. We would rather represent fewer homes well than list everything and market nothing
              properly.
            </p>
            <p>
              That means honest valuations, photography that does a property justice, and advisers who can tell
              you what it is actually like to live on a particular street — the commute, the coffee, the light in
              the afternoon.
            </p>
          </div>
          <div className="space-y-px self-start border border-line bg-line">
            {[
              ["Neighbourhoods", "Focused, local, genuinely known"],
              ["Approach", "Design-led marketing, straight advice"],
              ["Services", "Sales, lettings and management"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper p-6">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">{k}</p>
                <p className="mt-1 font-display text-xl text-ink">{v}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {agents.length > 0 && (
        <Section surface>
          <Container>
            <SectionHeading eyebrow="The team" title="People, not call centres" />
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a) => (
                <div key={a.id} className="border border-line bg-paper p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent font-display text-xl text-accent">
                    {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ink">{a.name}</h3>
                  <p className="text-[0.8rem] uppercase tracking-[0.1em] text-accent">{a.title}</p>
                  {a.bio && <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{a.bio}</p>}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="text-center">
        <Container>
          <h2 className="mx-auto max-w-xl font-display text-3xl sm:text-4xl">Let&rsquo;s talk about your move</h2>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/valuation" variant="primary">Book a valuation</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
          </div>
        </Container>
      </Section>
    </div>
  );
}
