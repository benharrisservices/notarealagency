import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sell your property",
  description: "Sell your London home with NARA — honest valuations, design-led marketing and the right buyer.",
};

const STEPS = [
  ["Valuation", "We assess your property against real, recent comparable evidence and agree a realistic asking price."],
  ["Preparation", "Professional photography, floorplans and a considered listing that shows your home at its best."],
  ["Marketing", "Exposure across the major portals and our own audience, with viewings handled personally."],
  ["Offer & sale", "We negotiate on your behalf, qualify every buyer and manage the sale through to completion."],
];

export default function SellPage() {
  return (
    <div>
      <Section>
        <Container className="max-w-3xl">
          <Eyebrow className="mb-3">Selling</Eyebrow>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Sell with people who know your area</h1>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            A good sale is not about the highest valuation on paper — it is about the right price, the right
            buyer and a process that holds together to completion. That is what we do.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/valuation" variant="primary">Book a free valuation</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Speak to us</ButtonLink>
          </div>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <SectionHeading eyebrow="How it works" title="A clear path to completion" />
          <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="bg-paper p-7">
                <span className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="text-center">
        <Container>
          <h2 className="mx-auto max-w-xl font-display text-3xl sm:text-4xl">Find out what your home is worth</h2>
          <p className="mx-auto mt-4 max-w-md text-muted">Free, accurate and without obligation.</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/valuation" variant="primary">Book a valuation</ButtonLink>
          </div>
        </Container>
      </Section>
    </div>
  );
}
