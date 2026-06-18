const gbpFmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function gbp(value: number): string {
  return gbpFmt.format(value);
}

const QUALIFIER_PREFIX: Record<string, string> = {
  GUIDE: "Sale price ",
  OFFERS_OVER: "Offers over ",
  OFFERS_IN_EXCESS_OF: "Sale price ",
  FIXED: "Fixed price ",
  FROM: "From ",
  POA: "",
};

type PriceShape = {
  price: number;
  priceQualifier: string;
  transactionType: string;
  rentFrequency?: string | null;
};

export function formatPrice(p: PriceShape): string {
  if (p.priceQualifier === "POA") return "Price on application";
  const prefix = QUALIFIER_PREFIX[p.priceQualifier] ?? "";
  if (p.transactionType === "LETTING") {
    const suffix = p.rentFrequency === "PW" ? " pw" : " pcm";
    return `${gbp(p.price)}${suffix}`;
  }
  return `${prefix}${gbp(p.price)}`;
}

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  AVAILABLE: "Available",
  UNDER_OFFER: "Under offer",
  SOLD: "Sold",
  LET_AGREED: "Let agreed",
  LET: "Let",
  WITHDRAWN: "Withdrawn",
};

export const PROPERTY_TYPE_LABEL: Record<string, string> = {
  APARTMENT: "Apartment",
  FLAT: "Flat",
  STUDIO: "Studio",
  TERRACED: "Terraced house",
  SEMI_DETACHED: "Semi-detached house",
  DETACHED: "Detached house",
  MAISONETTE: "Maisonette",
  TOWNHOUSE: "Townhouse",
  BUNGALOW: "Bungalow",
  PENTHOUSE: "Penthouse",
  MEWS: "Mews house",
  NEW_BUILD: "New build",
};

export const TENURE_LABEL: Record<string, string> = {
  FREEHOLD: "Freehold",
  LEASEHOLD: "Leasehold",
  SHARE_OF_FREEHOLD: "Share of freehold",
  COMMONHOLD: "Commonhold",
};

export const OUTDOOR_LABEL: Record<string, string> = {
  NONE: "None",
  BALCONY: "Balcony",
  PATIO: "Patio",
  GARDEN: "Private garden",
  TERRACE: "Terrace",
  ROOF_TERRACE: "Roof terrace",
  COMMUNAL_GARDEN: "Communal garden",
};

export function formatArea(sqft?: number | null, sqm?: number | null): string | null {
  if (sqft && sqm) return `${sqft.toLocaleString("en-GB")} sq ft / ${Math.round(sqm)} m²`;
  if (sqft) return `${sqft.toLocaleString("en-GB")} sq ft`;
  if (sqm) return `${Math.round(sqm)} m²`;
  return null;
}

export function bedLabel(bedrooms: number): string {
  return bedrooms === 0 ? "Studio" : `${bedrooms} bed`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
