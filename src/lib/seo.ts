import { siteConfig } from "./site";
import { formatPrice, PROPERTY_TYPE_LABEL } from "./format";

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type PropertyForSeo = {
  slug: string;
  title: string;
  summary: string;
  price: number;
  priceQualifier: string;
  transactionType: string;
  rentFrequency?: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqm?: number | null;
  displayAddress: string;
  postcode: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  images: { url: string }[];
};

export function propertyJsonLd(p: PropertyForSeo) {
  return {
    "@context": "https://schema.org",
    "@type": ["Residence", "Product"],
    name: p.title,
    description: p.summary,
    url: absoluteUrl(`/properties/${p.slug}`),
    image: p.images.map((i) => absoluteUrl(i.url)),
    numberOfBedrooms: p.bedrooms,
    numberOfBathroomsTotal: p.bathrooms,
    ...(p.floorAreaSqm
      ? { floorSize: { "@type": "QuantitativeValue", value: p.floorAreaSqm, unitCode: "MTK" } }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: p.displayAddress,
      addressLocality: p.city,
      postalCode: p.postcode,
      addressCountry: "GB",
    },
    ...(p.latitude && p.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: p.latitude, longitude: p.longitude } }
      : {}),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/properties/${p.slug}`),
      description: `${formatPrice(p)} — ${PROPERTY_TYPE_LABEL[p.propertyType] ?? "Property"}`,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    image: absoluteUrl("/brand/og-default.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postcode,
      addressCountry: siteConfig.address.country,
    },
    areaServed: "London",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}
