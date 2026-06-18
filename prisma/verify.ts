/**
 * Production database verification (READ-ONLY — makes no writes).
 *
 * Run AFTER applying the schema and seeding, with DATABASE_URL pointed at the
 * database your deployed app actually uses:
 *
 *   DATABASE_URL="<prod-connection-string>" npx tsx prisma/verify.ts
 *   # or, with the helper script:  npm run db:verify
 *
 * It confirms that tables and records exist and that the exact queries the
 * homepage runs all succeed.
 */
import { prisma } from "../src/lib/prisma";
import { getFeaturedProperties } from "../src/lib/properties";
import { getLocationOptions, getAreaGuides } from "../src/lib/content";

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? "  —  " + detail : ""}`);
  if (!ok) failures++;
}

async function main() {
  console.log("NARA — production database verification\n");

  // 1. Row counts — proves tables exist and the seed ran.
  const counts = {
    User: await prisma.user.count(),
    Agent: await prisma.agent.count(),
    Location: await prisma.location.count(),
    AreaGuide: await prisma.areaGuide.count(),
    Property: await prisma.property.count(),
    PropertyImage: await prisma.propertyImage.count(),
    BlogPost: await prisma.blogPost.count(),
    Enquiry: await prisma.enquiry.count(),
  };
  console.log("Row counts:");
  for (const [k, v] of Object.entries(counts)) console.log(`   ${k.padEnd(15)} ${v}`);
  console.log("");

  check("Location records exist", counts.Location > 0, `${counts.Location} rows`);
  check("Property records exist", counts.Property > 0, `${counts.Property} rows`);
  check("AreaGuide records exist", counts.AreaGuide > 0, `${counts.AreaGuide} rows`);
  check("Admin user seeded", counts.User > 0, `${counts.User} user(s)`);

  // 2. Homepage data path — the exact functions the homepage calls.
  try {
    const featured = await getFeaturedProperties(3);
    check("Homepage query: getFeaturedProperties()", featured.length > 0, `${featured.length} featured`);
  } catch (e) {
    check("Homepage query: getFeaturedProperties()", false, (e as Error).message);
  }
  try {
    const locs = await getLocationOptions();
    check("Homepage query: getLocationOptions()", locs.length > 0, `${locs.length} locations`);
  } catch (e) {
    check("Homepage query: getLocationOptions()", false, (e as Error).message);
  }
  try {
    const guides = await getAreaGuides();
    check("Homepage query: getAreaGuides()", guides.length > 0, `${guides.length} guides`);
  } catch (e) {
    check("Homepage query: getAreaGuides()", false, (e as Error).message);
  }

  // 3. Headline listing + detail relations.
  try {
    const headline = await prisma.property.findUnique({
      where: { slug: "cable-street-e1" },
      include: { images: true, location: { include: { areaGuide: true } }, agent: true },
    });
    check("Headline listing present", !!headline, headline ? `${headline.images.length} images` : "missing");
  } catch (e) {
    check("Headline listing present", false, (e as Error).message);
  }

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
  await prisma.$disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("\nVERIFY ERROR — the database likely has no tables, or DATABASE_URL is wrong:\n");
  console.error(e instanceof Error ? e.message : e);
  await prisma.$disconnect();
  process.exit(1);
});
