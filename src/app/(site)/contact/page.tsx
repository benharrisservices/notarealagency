import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { PropertyMap } from "@/components/property/property-map";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NARA — book a viewing, request a valuation or ask us anything.",
};

export default function ContactPage() {
  return (
    <Container className="py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-3">Contact</Eyebrow>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Get in touch</h1>
          <p className="mt-4 max-w-md text-muted">
            Call, email or send us a message — whether you are buying, selling, letting or just exploring.
          </p>

          <dl className="mt-8 space-y-5 text-[0.95rem]">
            <div>
              <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">Office</dt>
              <dd className="mt-1 text-ink-2">
                {siteConfig.address.line1}<br />
                {siteConfig.address.line2}<br />
                {siteConfig.address.city} {siteConfig.address.postcode}
              </dd>
            </div>
            <div>
              <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">Telephone</dt>
              <dd className="mt-1"><a href={siteConfig.phoneHref} className="text-ink-2 hover:text-accent">{siteConfig.phone}</a></dd>
            </div>
            <div>
              <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">Email</dt>
              <dd className="mt-1"><a href={`mailto:${siteConfig.email}`} className="text-ink-2 hover:text-accent">{siteConfig.email}</a></dd>
            </div>
          </dl>

          <div className="mt-8 border border-line">
            <PropertyMap markers={[{ lat: 51.5428, lng: -0.0246, label: siteConfig.name }]} zoom={15} className="h-[280px]" />
          </div>
        </div>

        <div className="border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-5 font-display text-2xl text-ink">Send a message</h2>
          <EnquiryForm showTypeSelect defaultType="GENERAL" submitLabel="Send message" />
        </div>
      </div>
    </Container>
  );
}
