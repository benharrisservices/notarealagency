import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { ValuationForm } from "@/components/property/valuation-form";

export const metadata: Metadata = {
  title: "Book a valuation",
  description: "Request a free, no-obligation sales or lettings valuation of your London property.",
};

export default function ValuationPage() {
  return (
    <Container className="grid gap-12 py-14 lg:grid-cols-2">
      <div>
        <Eyebrow className="mb-3">Valuation</Eyebrow>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">What is your home worth?</h1>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted">
          A valuation with NARA is honest, considered and free of obligation. We will look at your
          property, the local market and recent comparable sales, then talk you through a realistic figure
          and the best route to market.
        </p>
        <ul className="mt-8 space-y-3 text-ink-2">
          {["Free and without obligation", "Accurate, evidence-led figures", "Advice on sale or letting", "From advisers who know your area"].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <svg className="mt-0.5 shrink-0 text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m5 13 4 4L19 7" /></svg>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-line bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-display text-2xl text-ink">Request your valuation</h2>
        <ValuationForm />
      </div>
    </Container>
  );
}
