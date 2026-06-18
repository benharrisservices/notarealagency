// Opportunity Type taxonomy.
//
// NARA is a property *opportunities* platform, not only a residential agency.
// This taxonomy is introduced at the code/UX layer first, with no schema change.
//
// Clean migration path (when filtering by type is needed):
//   1. Add an optional enum to schema.prisma:
//        enum OpportunityType { RESIDENTIAL DEVELOPMENT COMMERCIAL_CONVERSION
//                               AUCTION OFF_MARKET VACANT_ASSET MIXED_USE INVESTMENT }
//        model Property { opportunityType OpportunityType @default(RESIDENTIAL) ... }
//   2. `prisma db push` (additive, non-destructive; existing rows default to RESIDENTIAL).
//   3. Surface a `?opportunity=` filter in parsePropertyFilters/buildWhere and the admin form.
// Until then the keys below double as the future enum values.

export type OpportunityKey =
  | "RESIDENTIAL"
  | "DEVELOPMENT"
  | "COMMERCIAL_CONVERSION"
  | "AUCTION"
  | "OFF_MARKET"
  | "VACANT_ASSET"
  | "MIXED_USE"
  | "INVESTMENT";

export interface OpportunityType {
  key: OpportunityKey;
  label: string;
  blurb: string;
}

export const opportunityTypes: OpportunityType[] = [
  { key: "RESIDENTIAL", label: "Residential", blurb: "Houses and apartments to live in or let." },
  { key: "DEVELOPMENT", label: "Development", blurb: "Sites and buildings with planning or permitted-development potential." },
  { key: "COMMERCIAL_CONVERSION", label: "Commercial Conversion", blurb: "Offices, units and retail suited to residential change of use." },
  { key: "AUCTION", label: "Auction", blurb: "Lots offered to a deadline, for decisive buyers." },
  { key: "OFF_MARKET", label: "Off-Market", blurb: "Quietly available, shown to registered buyers first." },
  { key: "VACANT_ASSET", label: "Vacant Asset", blurb: "Empty buildings ready to be repositioned." },
  { key: "MIXED_USE", label: "Mixed Use", blurb: "Combined residential and commercial in a single asset." },
  { key: "INVESTMENT", label: "Investment", blurb: "Tenanted and income-producing opportunities." },
];

export const OPPORTUNITY_LABEL: Record<OpportunityKey, string> = Object.fromEntries(
  opportunityTypes.map((o) => [o.key, o.label]),
) as Record<OpportunityKey, string>;

// Resolve a listing's opportunity label. UI layer only: until an optional
// `opportunityType` column is added to Property, this returns the field if
// present, otherwise defaults to Residential. Wiring the future column changes
// nothing else on the site.
export function getOpportunityLabel(property?: { opportunityType?: string | null }): string {
  const key = ((property?.opportunityType as OpportunityKey) || "RESIDENTIAL") as OpportunityKey;
  return `${OPPORTUNITY_LABEL[key] ?? "Residential"} Opportunity`;
}
