import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BASE = "/properties/cable-street-e1";
const img = (n: string) => `${BASE}/${n}`;

async function reset() {
  await prisma.savedProperty.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.propertyAlert.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.property.deleteMany();
  await prisma.areaGuide.deleteMany();
  await prisma.location.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  // Safety guard: this seed wipes every table before inserting. Refuse to run
  // against a database that already holds data unless explicitly forced.
  const existing = (await prisma.user.count()) + (await prisma.property.count());
  if (existing > 0 && process.env.SEED_RESET !== "true") {
    console.error(
      "Refusing to seed: the database already contains data.\n" +
        "This seed deletes all rows before inserting. To intentionally wipe and reseed,\n" +
        "re-run with SEED_RESET=true (e.g. `npm run db:seed:fresh`)."
    );
    await prisma.$disconnect();
    process.exit(0);
  }

  await reset();

  // ---------------- Admin user ----------------
  const email = process.env.ADMIN_EMAIL || "admin@nara.london";
  const password = process.env.ADMIN_PASSWORD || "nara-admin";
  await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name: "NARA Admin",
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${email}`);

  // ---------------- Agent ----------------
  const eleanor = await prisma.agent.create({
    data: {
      slug: "eleanor-whitfield",
      name: "Eleanor Whitfield",
      title: "Director, Sales",
      email: "eleanor@nara.london",
      phone: "+44 (0)20 3667 2100",
      bio: "Eleanor leads NARA's residential sales across East and North-East London, with a focus on character homes and value opportunities.",
    },
  });

  // ---------------- Location ----------------
  const shadwell = await prisma.location.create({
    data: {
      slug: "shadwell",
      name: "Shadwell",
      borough: "London Borough of Tower Hamlets",
      region: "Central East London",
      postcodePrefixes: ["E1"],
      latitude: 51.5102,
      longitude: -0.05,
      heroImage: img("07-balcony-day.jpg"),
      description: "A central pocket of East London around Cable Street, between the City, Wapping and Whitechapel.",
    },
  });

  // ---------------- Insights ----------------
  await prisma.blogPost.createMany({
    data: [
      {
        slug: "what-a-private-balcony-adds-to-an-east-london-flat",
        title: "What private outdoor space really adds to an East London flat",
        excerpt:
          "Outdoor space is the scarcest commodity in inner-city living. We look at how a genuine private balcony changes both daily life and resale value.",
        body:
          "In a market where square footage is counted carefully, private outdoor space has quietly become one of the most sought-after features a London flat can offer...\n\nA well-proportioned balcony extends the living space outward, creates a genuine room for entertaining, and tends to hold its value through softer markets.",
        author: "NARA",
        tags: ["Buying", "East London", "Outdoor space"],
        coverImage: img("07-balcony-day.jpg"),
      },
      {
        slug: "buying-a-residential-opportunity-what-to-look-for",
        title: "Buying a residential opportunity: what to look for",
        excerpt:
          "Properties needing improvement can offer real value — if you read them correctly. A short guide to assessing an opportunity before you offer.",
        body:
          "An opportunity is only an opportunity if the numbers work. We look at how to weigh the cost of works against the value created, what to verify before exchange, and how to judge a property's ceiling...\n\nThe questions every buyer should put to the seller before committing — tenure, outgoings, condition and consents.",
        author: "NARA",
        tags: ["Buying", "Opportunities", "Guides"],
        coverImage: img("01-reception.jpg"),
      },
    ],
  });

  // ============================================================
  // THE LISTING — Cable Street (the single, real opportunity)
  // Facts drawn from the floorplan and EPC; unknowns marked "to be confirmed".
  // ============================================================
  const cableStreet = await prisma.property.create({
    data: {
      slug: "cable-street-e1",
      reference: "NARA-CS-0001",
      title: "Two Bedroom Maisonette with Private Balcony",
      summary:
        "A two bedroom maisonette with a private balcony on Cable Street, E1 — 932 sq ft over two floors, offered as a residential opportunity in Central East London.",
      description:
        "A two bedroom maisonette arranged over two floors at 418-422 Cable Street, in Central East London (E1), with a private balcony and a gross internal area of 932 sq ft (86.6 sq m).\n\n" +
        "The accommodation comprises a reception room, a separate dining room and a kitchen on the first floor, opening onto a private balcony of 152 sq ft, with two bedrooms, a bathroom and generous storage on the second floor.\n\n" +
        "A residential opportunity requiring varying levels of improvement, suitable for owner occupiers, first-time buyers and investors seeking value in Central East London.\n\n" +
        "Tenure and outgoings are to be confirmed.",
      transactionType: "SALE",
      status: "AVAILABLE",
      propertyType: "MAISONETTE",
      tenure: null, // to be confirmed
      price: 285000,
      priceQualifier: "GUIDE", // displays as "Sale price"
      bedrooms: 2,
      bathrooms: 1,
      receptions: 2,
      floorAreaSqft: 932,
      floorAreaSqm: 86.6,
      features: [
        "Two bedrooms arranged over two floors",
        "Private balcony — 5.84m × 2.44m (152 sq ft)",
        "Separate reception and dining rooms",
        "932 sq ft / 86.6 sq m gross internal area",
        "Two storage cupboards",
        "Residential opportunity requiring improvement",
      ],
      chainFree: false,
      newBuild: false,
      parking: false,
      outdoorSpace: "BALCONY",
      outdoorDetail: "Private balcony — 5.84m × 2.44m (152 sq ft).",
      councilTaxBand: null, // to be confirmed
      epcRating: "D",
      epcScore: 67,
      epcPotential: "C",
      epcPotentialScore: 70,
      leaseYears: null,
      serviceCharge: null,
      groundRent: null,
      displayAddress: "Cable Street, London E1",
      addressLine1: "418-422 Cable Street",
      city: "London",
      postcode: "E1 0AF",
      latitude: 51.5102,
      longitude: -0.05,
      featured: true,
      publishedAt: new Date(),
      locationId: shadwell.id,
      agentId: eleanor.id,
      images: {
        create: [
          { url: img("01-reception.jpg"), alt: "Reception room", sortOrder: 0, isPrimary: true },
          { url: img("07-balcony-day.jpg"), alt: "Private balcony", sortOrder: 1, isPrimary: false },
          { url: img("02-reception-alt.jpg"), alt: "Reception room, alternative view", sortOrder: 2, isPrimary: false },
          { url: img("03-kitchen.jpg"), alt: "Kitchen", sortOrder: 3, isPrimary: false },
          { url: img("04-bedroom-one.jpg"), alt: "Principal bedroom", sortOrder: 4, isPrimary: false },
          { url: img("06-bathroom.jpg"), alt: "Bathroom", sortOrder: 5, isPrimary: false },
          { url: img("05-bedroom-one-alt.jpg"), alt: "Principal bedroom, alternative view", sortOrder: 6, isPrimary: false },
          { url: img("08-balcony-dusk.jpg"), alt: "Balcony at dusk", sortOrder: 7, isPrimary: false },
        ],
      },
      documents: {
        create: [
          { type: "FLOORPLAN", title: "Floorplan", url: img("floorplan.png") },
          { type: "EPC", title: "Energy Performance", url: img("epc-energy.png") },
          { type: "EPC", title: "Environmental Impact (CO₂)", url: img("epc-co2.png") },
        ],
      },
    },
  });
  console.log(`Listing: ${cableStreet.slug} (${cableStreet.reference})`);

  // ---------------- A sample enquiry ----------------
  await prisma.enquiry.create({
    data: {
      type: "VIEWING",
      name: "Sample Enquirer",
      email: "buyer@example.com",
      phone: "07700 900000",
      message: "I would like to arrange a viewing of the Cable Street maisonette.",
      propertyId: cableStreet.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
