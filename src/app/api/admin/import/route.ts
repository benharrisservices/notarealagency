import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// pdf-parse needs Node APIs (Buffer, fs) — not the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Extracted = {
  title?: string;
  address?: string;
  postcode?: string;
  summary?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  tenure?: string;
  epcRating?: string;
  floorAreaSqft?: number;
  price?: number;
  propertyType?: string;
  features?: string[];
};

const PROPERTY_TYPES = ["APARTMENT", "FLAT", "HOUSE", "STUDIO", "MAISONETTE", "PENTHOUSE"];
const TENURES = ["LEASEHOLD", "FREEHOLD", "SHARE_OF_FREEHOLD"];

// ---- Heuristic extraction (no external dependency, always runs) ----
function extractHeuristic(raw: string): Extracted {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const joined = lines.join("\n");
  const out: Extracted = { features: [] };

  const priceM = joined.match(/£\s?([\d][\d,]{2,})/);
  if (priceM) out.price = parseInt(priceM[1].replace(/,/g, ""), 10);

  const bedM = joined.match(/(\d+)\s*(?:bed(?:room)?s?)\b/i);
  if (bedM) out.bedrooms = parseInt(bedM[1], 10);
  const bathM = joined.match(/(\d+)\s*(?:bath(?:room)?s?)\b/i);
  if (bathM) out.bathrooms = parseInt(bathM[1], 10);

  if (/share of freehold/i.test(joined)) out.tenure = "SHARE_OF_FREEHOLD";
  else if (/freehold/i.test(joined)) out.tenure = "FREEHOLD";
  else if (/leasehold/i.test(joined)) out.tenure = "LEASEHOLD";

  const epcM = joined.match(/EPC[^A-Za-z0-9]{0,8}([A-G])\b/i);
  if (epcM) out.epcRating = epcM[1].toUpperCase();

  const sqftM = joined.match(/([\d,]+(?:\.\d+)?)\s*(?:sq\s?\.?\s?ft|sqft|square feet)/i);
  if (sqftM) out.floorAreaSqft = Math.round(parseFloat(sqftM[1].replace(/,/g, "")));
  else {
    const sqmM = joined.match(/([\d,]+(?:\.\d+)?)\s*(?:sq\s?\.?\s?m|sqm|square met)/i);
    if (sqmM) out.floorAreaSqft = Math.round(parseFloat(sqmM[1].replace(/,/g, "")) * 10.7639);
  }

  if (/penthouse/i.test(joined)) out.propertyType = "PENTHOUSE";
  else if (/studio/i.test(joined)) out.propertyType = "STUDIO";
  else if (/maisonette/i.test(joined)) out.propertyType = "MAISONETTE";
  else if (/\bhouse\b|terraced|semi-detached|detached/i.test(joined)) out.propertyType = "HOUSE";
  else if (/apartment|flat/i.test(joined)) out.propertyType = "APARTMENT";

  const pcM = joined.match(/\b([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})\b/);
  if (pcM) out.postcode = pcM[1].toUpperCase();

  if (out.postcode) {
    const addrLine = lines.find((l) => l.toUpperCase().includes(out.postcode!));
    if (addrLine) out.address = addrLine;
  }
  if (!out.address) {
    const comma = lines.find((l) => /,/.test(l) && l.length < 90);
    if (comma) out.address = comma;
  }

  out.title =
    lines.find((l) => /bed|apartment|flat|house|studio|penthouse/i.test(l) && l.length < 90) || lines[0];

  out.features = lines
    .filter((l) => /^[•\-\u2022*▪]/.test(l))
    .map((l) => l.replace(/^[•\-\u2022*▪]\s*/, "").trim())
    .filter((l) => l.length > 2 && l.length < 80)
    .slice(0, 12);

  const para = lines.find((l) => l.length > 60);
  if (para) out.summary = para.slice(0, 200);
  out.description = joined.slice(0, 4000);

  return out;
}

// ---- Optional LLM extraction (only if ANTHROPIC_API_KEY is set) ----
async function extractWithAnthropic(text: string): Promise<Extracted | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content:
            "Extract listing fields from this UK estate-agent brochure text. Return ONLY a JSON object with keys: " +
            "title, address, postcode, summary, description, bedrooms (number), bathrooms (number), " +
            "tenure (LEASEHOLD|FREEHOLD|SHARE_OF_FREEHOLD or null), epcRating (A-G or null), " +
            "floorAreaSqft (number or null), price (whole GBP number or null), " +
            "propertyType (APARTMENT|FLAT|HOUSE|STUDIO|MAISONETTE|PENTHOUSE), features (array of short strings). " +
            "Use null where a value is not stated. Do not invent values. No prose, no markdown.\n\nTEXT:\n" +
            text.slice(0, 12000),
        },
      ],
    }),
  });
  if (!res.ok) return null;

  const data = await res.json();
  const block = Array.isArray(data.content) ? data.content.find((c: { type: string }) => c.type === "text") : null;
  let s: string = (block as { text?: string })?.text?.trim() || "";
  s = s.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

  let json: Record<string, unknown>;
  try {
    json = JSON.parse(s);
  } catch {
    return null;
  }

  const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : undefined);
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  return {
    title: str(json.title),
    address: str(json.address),
    postcode: str(json.postcode),
    summary: str(json.summary),
    description: str(json.description),
    bedrooms: num(json.bedrooms),
    bathrooms: num(json.bathrooms),
    tenure: str(json.tenure),
    epcRating: str(json.epcRating),
    floorAreaSqft: num(json.floorAreaSqft),
    price: num(json.price),
    propertyType: str(json.propertyType),
    features: Array.isArray(json.features) ? (json.features as string[]).slice(0, 12) : undefined,
  };
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No PDF uploaded." }, { status: 400 });
  }
  if (file.type && !file.type.toLowerCase().includes("pdf")) {
    return NextResponse.json({ message: "Please upload a PDF file." }, { status: 400 });
  }

  // Extract text. Import the library file directly to avoid pdf-parse's debug block.
  let text = "";
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    // @ts-expect-error: pdf-parse ships no types and we import the inner module.
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const parsed = await pdfParse(buf);
    text = parsed?.text || "";
  } catch {
    return NextResponse.json(
      { message: "Could not read that PDF. It may be scanned or image-only." },
      { status: 422 },
    );
  }

  if (!text.trim()) {
    return NextResponse.json(
      { message: "No selectable text found in the PDF (it may be a scan)." },
      { status: 422 },
    );
  }

  let fields = extractHeuristic(text);
  try {
    const ai = await extractWithAnthropic(text);
    if (ai) fields = { ...fields, ...ai };
  } catch {
    // fall back silently to the heuristic result
  }

  // Normalise enum-ish values
  const propertyType =
    fields.propertyType && PROPERTY_TYPES.includes(fields.propertyType) ? fields.propertyType : "APARTMENT";
  const tenure = fields.tenure && TENURES.includes(fields.tenure) ? fields.tenure : null;
  const epcRating = fields.epcRating && /^[A-G]$/.test(fields.epcRating) ? fields.epcRating : null;

  const baseTitle = fields.title?.slice(0, 120) || "Imported listing — review required";
  const slug = `${slugify(baseTitle).slice(0, 60)}-${Date.now().toString(36)}`;
  const reference = `NARA-IMP-${Date.now().toString(36).toUpperCase().slice(-5)}`;

  const property = await prisma.property.create({
    data: {
      slug,
      reference,
      title: baseTitle,
      summary:
        fields.summary?.slice(0, 280) ||
        "Imported from PDF. Review and complete the details before publishing.",
      description: fields.description?.slice(0, 6000) || "Information to be confirmed.",
      status: "DRAFT",
      transactionType: "SALE",
      propertyType: propertyType as never,
      tenure: tenure as never,
      price: fields.price ?? 0,
      priceQualifier: "GUIDE",
      bedrooms: fields.bedrooms ?? 0,
      bathrooms: fields.bathrooms ?? 0,
      floorAreaSqft: fields.floorAreaSqft ?? null,
      epcRating,
      features: fields.features ?? [],
      displayAddress: fields.address?.slice(0, 200) || "Information to be confirmed",
      postcode: fields.postcode || "",
      featured: false,
      publishedAt: null,
    },
  });

  return NextResponse.json({
    id: property.id,
    reference,
    editUrl: `/admin/properties/${property.id}/edit`,
    extracted: fields,
  });
}
