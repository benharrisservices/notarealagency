import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyFeatures } from "@/components/property/property-features";
import { SpecTable } from "@/components/property/spec-table";
import { EpcChart } from "@/components/property/epc-chart";
import { MortgageCalculator } from "@/components/property/mortgage-calculator";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { PropertyMap } from "@/components/property/property-map";
import { SavePropertyButton } from "@/components/property/save-property-button";
import { PropertyGrid } from "@/components/property/property-grid";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/properties";
import {
  formatPrice, bedLabel, formatArea, PROPERTY_TYPE_LABEL, TENURE_LABEL, OUTDOOR_LABEL, gbp,
} from "@/lib/format";
import { propertyJsonLd, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";
import { OpportunityBadge } from "@/components/property/opportunity-badge";
import { getOpportunityLabel } from "@/lib/opportunities";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  const title = `${property.title}, ${property.displayAddress}`;
  const image = property.images[0]?.url ?? "/brand/og-default.jpg";
  return {
    title,
    description: property.summary,
    alternates: { canonical: absoluteUrl(`/properties/${property.slug}`) },
    openGraph: {
      title,
      description: property.summary,
      url: absoluteUrl(`/properties/${property.slug}`),
      images: [{ url: image, width: 1200, height: 800 }],
      type: "website",
    },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="mb-5 font-display text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelatedProperties({
    id: property.id,
    locationId: property.locationId,
    transactionType: property.transactionType,
  });

  const area = formatArea(property.floorAreaSqft, property.floorAreaSqm);
  const floorplan = property.documents.find((d) => d.type === "FLOORPLAN");
  const epcDocs = property.documents.filter((d) => d.type === "EPC");
  const guide = property.location?.areaGuide;
  const isSale = property.transactionType === "SALE";

  const tbc = "Information to be confirmed";
  const specRows: [string, string | null | undefined][] = [
    ["Price", formatPrice(property)],
    ["Opportunity type", getOpportunityLabel(property)],
    ["Property type", PROPERTY_TYPE_LABEL[property.propertyType]],
    ["Bedrooms", bedLabel(property.bedrooms)],
    ["Bathrooms", String(property.bathrooms)],
    ["Reception rooms", property.receptions ? String(property.receptions) : null],
    ["Tenure", property.tenure ? TENURE_LABEL[property.tenure] : tbc],
    ["Floor area", area ?? tbc],
    ["Outdoor space", property.outdoorSpace !== "NONE" ? OUTDOOR_LABEL[property.outdoorSpace] : null],
    ["Parking", property.parking ? property.parkingDetail || "Yes" : null],
    ["Council tax band", property.councilTaxBand],
    ["EPC rating", property.epcRating ?? tbc],
    ["Lease remaining", property.leaseYears ? `${property.leaseYears} years` : null],
    ["Service charge", property.serviceCharge ? `${gbp(property.serviceCharge)} pa` : null],
    ["Ground rent", property.groundRent ? `${gbp(property.groundRent)} pa` : null],
    ["Reference", property.reference],
  ];

  const QuickFact = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-0.5 font-display text-xl text-ink">{value}</p>
    </div>
  );

  return (
    <div className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(property)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Property search", url: "/properties" },
              { name: property.title, url: `/properties/${property.slug}` },
            ]),
          ),
        }}
      />

      <Container className="py-8">
        <nav className="mb-5 text-[0.75rem] text-muted">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="px-2">/</span>
          <Link href="/properties" className="hover:text-accent">Property search</Link>
          <span className="px-2">/</span>
          <span>{property.displayAddress}</span>
        </nav>

        <PropertyGallery images={property.images} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* MAIN */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <OpportunityBadge property={property} />
                  <StatusBadge status={property.status} />
                  {property.chainFree && isSale && (
                    <span className="bg-surface-2 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-2">Chain free</span>
                  )}
                </div>
                <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{property.title}</h1>
                <p className="mt-1 text-muted">{property.displayAddress}</p>
              </div>
              <SavePropertyButton slug={property.slug} />
            </div>

            <p className="mt-6 font-display text-4xl text-ink">{formatPrice(property)}</p>

            <div className="mt-6 grid grid-cols-2 gap-5 border-y border-line py-6 sm:grid-cols-4">
              <QuickFact label="Bedrooms" value={bedLabel(property.bedrooms)} />
              <QuickFact label="Bathrooms" value={String(property.bathrooms)} />
              {area && <QuickFact label="Floor area" value={area} />}
              {property.outdoorSpace !== "NONE" && <QuickFact label="Outdoor" value={OUTDOOR_LABEL[property.outdoorSpace]} />}
            </div>

            <div className="mt-8 whitespace-pre-line text-[1.02rem] leading-relaxed text-ink-2">
              {property.description}
            </div>

            {property.features.length > 0 && (
              <Block title="Key features">
                <PropertyFeatures features={property.features} />
              </Block>
            )}

            <Block title="Property details">
              <SpecTable rows={specRows} />
            </Block>

            {floorplan && (
              <Block title="Floorplan">
                <div className="border border-line bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={floorplan.url} alt="Floorplan" className="h-auto w-full" />
                </div>
              </Block>
            )}

            {(epcDocs.length > 0 || property.epcRating || property.epcPotential) && (
              <Block title="Energy performance">
                {epcDocs.length > 0 ? (
                  <div className="space-y-5">
                    {epcDocs.map((d) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={d.id}
                        src={d.url}
                        alt={d.title}
                        className="h-auto w-full border border-line bg-white"
                      />
                    ))}
                  </div>
                ) : (
                  <EpcChart
                    rating={property.epcRating}
                    score={property.epcScore}
                    potential={property.epcPotential}
                    potentialScore={property.epcPotentialScore}
                  />
                )}
              </Block>
            )}

            {guide && (guide.transport.length > 0 || guide.highlights.length > 0) && (
              <Block title="Location & transport">
                {guide.transport.length > 0 && (
                  <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {guide.transport.map((t) => (
                      <div key={t} className="flex items-start gap-3 border-b border-line-2 py-2.5 text-[0.92rem] text-ink-2">
                        <svg className="mt-0.5 shrink-0 text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                        {t}
                      </div>
                    ))}
                  </div>
                )}
                {guide.highlights.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">Local amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {guide.highlights.map((h) => (
                        <span key={h} className="border border-line bg-surface px-3 py-1.5 text-[0.82rem] text-ink-2">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                <Link href={`/areas/${guide.slug}`} className="mt-6 inline-block text-[0.76rem] font-semibold uppercase tracking-[0.1em] text-accent">
                  Read the {property.location?.name} area guide →
                </Link>
              </Block>
            )}

            {property.latitude && property.longitude && (
              <Block title="Location">
                <div className="border border-line">
                  <PropertyMap markers={[{ lat: property.latitude, lng: property.longitude, label: formatPrice(property) }]} zoom={15} />
                </div>
                <p className="mt-2 text-[0.82rem] text-ink-2">
                  {[property.addressLine1, property.city, property.postcode].filter(Boolean).join(", ")}
                </p>
                <p className="text-[0.74rem] text-muted">Pin location is approximate.</p>
              </Block>
            )}

            {isSale && (
              <Block title="Mortgage calculator">
                <MortgageCalculator defaultPrice={property.price} />
              </Block>
            )}
          </div>

          {/* SIDEBAR */}
          <aside>
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="border border-line bg-white p-6">
                <Eyebrow className="mb-2">{isSale ? "For sale" : "To let"}</Eyebrow>
                <p className="font-display text-3xl text-ink">{formatPrice(property)}</p>
                <p className="mt-1 text-[0.85rem] text-muted">{property.displayAddress}</p>
                <div className="mt-5 space-y-2.5 border-t border-line-2 pt-4 text-[0.9rem]">
                  <div className="flex justify-between"><span className="text-muted">Type</span><span className="font-medium text-ink">{PROPERTY_TYPE_LABEL[property.propertyType]}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Bedrooms</span><span className="font-medium text-ink">{bedLabel(property.bedrooms)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Bathrooms</span><span className="font-medium text-ink">{property.bathrooms}</span></div>
                  {property.tenure && <div className="flex justify-between"><span className="text-muted">Tenure</span><span className="font-medium text-ink">{TENURE_LABEL[property.tenure]}</span></div>}
                </div>
              </div>

              <div className="border border-line bg-white p-6">
                <h3 className="font-display text-xl text-ink">Arrange a viewing</h3>
                <p className="mt-1 mb-4 text-[0.85rem] text-muted">Register your interest and the team will be in touch.</p>
                <EnquiryForm propertyId={property.id} defaultType="VIEWING" submitLabel="Request viewing" />
              </div>

              {property.agent && (
                <div className="border border-line bg-surface p-6">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Your agent</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent font-display text-lg text-accent">
                      {property.agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-display text-lg text-ink">{property.agent.name}</p>
                      <p className="text-[0.78rem] text-muted">{property.agent.title}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-[0.85rem]">
                    {property.agent.phone && <a href={`tel:${property.agent.phone}`} className="block text-ink-2 hover:text-accent">{property.agent.phone}</a>}
                    <a href={`mailto:${property.agent.email}`} className="block text-ink-2 hover:text-accent">{property.agent.email}</a>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>

      {related.length > 0 && (
        <Section surface className="mt-8">
          <Container>
            <div className="mb-10">
              <Eyebrow className="mb-3">You may also like</Eyebrow>
              <h2 className="font-display text-3xl sm:text-[2.4rem]">Related properties</h2>
            </div>
            <PropertyGrid properties={related} />
          </Container>
        </Section>
      )}
    </div>
  );
}
