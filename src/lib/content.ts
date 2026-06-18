import { prisma } from "./prisma";
import { PUBLIC_STATUSES, propertyCardSelect } from "./properties";
import { Prisma } from "@prisma/client";

const publicStatus = { in: PUBLIC_STATUSES as unknown as Prisma.EnumListingStatusFilter["in"] };

export async function getLocations() {
  return prisma.location.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { properties: true } } },
  });
}

export async function getLocationOptions() {
  return prisma.location.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, region: true },
  });
}

export async function getAreaGuides() {
  return prisma.areaGuide.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
    include: { location: true },
  });
}

export async function getAreaGuideBySlug(slug: string) {
  const guide = await prisma.areaGuide.findUnique({
    where: { slug },
    include: { location: true },
  });
  if (!guide) return null;
  const properties = guide.locationId
    ? await prisma.property.findMany({
        where: { locationId: guide.locationId, status: publicStatus },
        orderBy: { featured: "desc" },
        select: propertyCardSelect,
        take: 6,
      })
    : [];
  return { guide, properties };
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}
