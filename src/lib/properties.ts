import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const PUBLIC_STATUSES = ["AVAILABLE", "UNDER_OFFER", "LET_AGREED"] as const;

export type SortKey = "newest" | "price_asc" | "price_desc" | "beds_desc";

export interface PropertyFilters {
  transaction?: "SALE" | "LETTING";
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  tenure?: string;
  location?: string; // location slug
  q?: string;
  outdoor?: string; // "ANY" | enum value
  parking?: boolean;
  chainFree?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // km
  sort?: SortKey;
  page?: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v ?? undefined;
}
function num(v: string | string[] | undefined): number | undefined {
  const s = one(v);
  if (s === undefined || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}
function bool(v: string | string[] | undefined): boolean | undefined {
  const s = one(v);
  if (s === undefined) return undefined;
  return s === "true" || s === "1" || s === "on";
}

export function parsePropertyFilters(params: RawParams): PropertyFilters {
  const transaction = one(params.transaction);
  const sort = one(params.sort) as SortKey | undefined;
  return {
    transaction: transaction === "LETTING" ? "LETTING" : transaction === "SALE" ? "SALE" : undefined,
    type: one(params.type),
    minPrice: num(params.minPrice),
    maxPrice: num(params.maxPrice),
    minBeds: num(params.minBeds),
    maxBeds: num(params.maxBeds),
    minBaths: num(params.minBaths),
    tenure: one(params.tenure),
    location: one(params.location),
    q: one(params.q),
    outdoor: one(params.outdoor),
    parking: bool(params.parking),
    chainFree: bool(params.chainFree),
    lat: num(params.lat),
    lng: num(params.lng),
    radius: num(params.radius),
    sort: sort && ["newest", "price_asc", "price_desc", "beds_desc"].includes(sort) ? sort : "newest",
    page: num(params.page) ?? 1,
  };
}

export function buildWhere(f: PropertyFilters, includeAllStatuses = false): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};
  const and: Prisma.PropertyWhereInput[] = [];

  if (!includeAllStatuses) where.status = { in: PUBLIC_STATUSES as unknown as Prisma.EnumListingStatusFilter["in"] };
  if (f.transaction) where.transactionType = f.transaction as Prisma.PropertyWhereInput["transactionType"];
  if (f.type) where.propertyType = f.type as Prisma.PropertyWhereInput["propertyType"];
  if (f.tenure) where.tenure = f.tenure as Prisma.PropertyWhereInput["tenure"];

  if (f.minPrice !== undefined || f.maxPrice !== undefined) {
    where.price = {};
    if (f.minPrice !== undefined) where.price.gte = f.minPrice;
    if (f.maxPrice !== undefined) where.price.lte = f.maxPrice;
  }
  if (f.minBeds !== undefined || f.maxBeds !== undefined) {
    where.bedrooms = {};
    if (f.minBeds !== undefined) where.bedrooms.gte = f.minBeds;
    if (f.maxBeds !== undefined) where.bedrooms.lte = f.maxBeds;
  }
  if (f.minBaths !== undefined) where.bathrooms = { gte: f.minBaths };

  if (f.parking) where.parking = true;
  if (f.chainFree) where.chainFree = true;

  if (f.outdoor && f.outdoor !== "ANY") {
    if (f.outdoor === "true") where.outdoorSpace = { not: "NONE" };
    else where.outdoorSpace = f.outdoor as Prisma.PropertyWhereInput["outdoorSpace"];
  }

  if (f.location) {
    and.push({ location: { slug: f.location } });
  }

  if (f.q) {
    and.push({
      OR: [
        { title: { contains: f.q, mode: "insensitive" } },
        { displayAddress: { contains: f.q, mode: "insensitive" } },
        { postcode: { contains: f.q, mode: "insensitive" } },
        { summary: { contains: f.q, mode: "insensitive" } },
      ],
    });
  }

  // Simple radius via bounding box (approximate, no PostGIS required).
  if (f.lat !== undefined && f.lng !== undefined && f.radius) {
    const dLat = f.radius / 111;
    const dLng = f.radius / (111 * Math.cos((f.lat * Math.PI) / 180) || 1);
    and.push({
      latitude: { gte: f.lat - dLat, lte: f.lat + dLat },
      longitude: { gte: f.lng - dLng, lte: f.lng + dLng },
    });
  }

  if (and.length) where.AND = and;
  return where;
}

function orderBy(sort?: SortKey): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "beds_desc":
      return { bedrooms: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export const propertyCardSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  price: true,
  priceQualifier: true,
  transactionType: true,
  rentFrequency: true,
  status: true,
  propertyType: true,
  tenure: true,
  bedrooms: true,
  bathrooms: true,
  receptions: true,
  floorAreaSqft: true,
  floorAreaSqm: true,
  outdoorSpace: true,
  chainFree: true,
  displayAddress: true,
  postcode: true,
  latitude: true,
  longitude: true,
  featured: true,
  images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true, alt: true } },
} satisfies Prisma.PropertySelect;

const PER_PAGE = 9;

export async function searchProperties(filters: PropertyFilters, perPage = PER_PAGE) {
  const where = buildWhere(filters);
  const page = Math.max(filters.page ?? 1, 1);
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: orderBy(filters.sort),
      select: propertyCardSelect,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.property.count({ where }),
  ]);
  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(Math.ceil(total / perPage), 1),
  };
}

export async function getMapProperties(filters: PropertyFilters) {
  return prisma.property.findMany({
    where: buildWhere(filters),
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      priceQualifier: true,
      transactionType: true,
      rentFrequency: true,
      bedrooms: true,
      displayAddress: true,
      latitude: true,
      longitude: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
    },
    take: 200,
  });
}

export async function getFeaturedProperties(take = 3) {
  return prisma.property.findMany({
    where: { featured: true, status: { in: PUBLIC_STATUSES as unknown as Prisma.EnumListingStatusFilter["in"] } },
    orderBy: { createdAt: "desc" },
    select: propertyCardSelect,
    take,
  });
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      documents: true,
      agent: true,
      location: { include: { areaGuide: true } },
    },
  });
}

export async function getRelatedProperties(args: {
  id: string;
  locationId?: string | null;
  transactionType: string;
  take?: number;
}) {
  const take = args.take ?? 3;
  return prisma.property.findMany({
    where: {
      id: { not: args.id },
      status: { in: PUBLIC_STATUSES as unknown as Prisma.EnumListingStatusFilter["in"] },
      OR: [
        args.locationId ? { locationId: args.locationId } : {},
        { transactionType: args.transactionType as Prisma.PropertyWhereInput["transactionType"] },
      ],
    },
    orderBy: { featured: "desc" },
    select: propertyCardSelect,
    take,
  });
}

export async function getAllPropertySlugs() {
  return prisma.property.findMany({
    where: { status: { in: PUBLIC_STATUSES as unknown as Prisma.EnumListingStatusFilter["in"] } },
    select: { slug: true, updatedAt: true },
  });
}

export type PropertyCard = Awaited<ReturnType<typeof getFeaturedProperties>>[number];
export type PropertyDetail = NonNullable<Awaited<ReturnType<typeof getPropertyBySlug>>>;
