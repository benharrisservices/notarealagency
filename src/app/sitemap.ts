import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPropertySlugs } from "@/lib/properties";
import { getAreaGuides, getBlogPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const [properties, areas, posts] = await Promise.all([
    getAllPropertySlugs(),
    getAreaGuides(),
    getBlogPosts(),
  ]);

  const staticPaths = ["", "/properties", "/map", "/areas", "/about", "/sell", "/lettings", "/valuation", "/contact", "/insights"];

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...properties.map((p) => ({ url: `${base}/properties/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "daily" as const, priority: 0.9 })),
    ...areas.map((a) => ({ url: `${base}/areas/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((b) => ({ url: `${base}/insights/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
