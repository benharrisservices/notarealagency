import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lettings & management",
  description: "Lettings and property management for London landlords — well-matched tenancies and straightforward service.",
};

const SERVICES = [
  ["Let only", "We find and reference a well-matched tenant, handle the paperwork and set the tenancy up correctly."],
  ["Rent collection", "Everything in Let Only, plus monthly rent collection and arrears management on your behalf."],
  ["Full management", "A hands-off service covering maintenance, inspections, compliance and a single point of contact."],
];

export default function LettingsPage() {
  return (
    <div>
      <Section>
        <Container className="max-w-3xl">
          <Eyebrow className="mb-3">Lettings</Eyebrow>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Lettings, managed properly</h1>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            Whether you are letting a first flat or managing a portfolio, we match good tenants to good homes and
            keep the whole thing running smoothly — so being a landlord feels like less of a second job.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/valuation" variant="primary">Request a rental valuation</ButtonLink>
            <ButtonLink href="/properties?transaction=LETTING" variant="outline">View properties to let</ButtonLink>
          </div>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <SectionHeading eyebrow="Landlord services" title="Choose the level of service you need" />
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {SERVICES.map(([title, body]) => (
              <div key={title} className="bg-paper p-7">
                <h3 className="font-display text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[0.85rem] text-muted">
            All managed tenancies include compliance with current safety and deposit-protection requirements.
          </p>
        </Container>
      </Section>
    </div>
  );
}
