import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const enquirySchema = z.object({
  type: z.enum(["VIEWING", "SALES", "VALUATION", "LETTINGS", "CALLBACK", "GENERAL"]).default("GENERAL"),
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(5, "Enter a short message."),
  propertyId: z.string().optional(),
});

export const valuationSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(5, "Enter a contact number."),
  address: z.string().min(4, "Enter the property address."),
  propertyType: z.string().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  message: z.string().optional().or(z.literal("")),
});

const numberish = z.coerce.number();

export const propertyInputSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(3),
  reference: z.string().min(2),
  summary: z.string().min(10),
  description: z.string().min(20),
  transactionType: z.enum(["SALE", "LETTING"]),
  status: z.enum(["DRAFT", "AVAILABLE", "UNDER_OFFER", "SOLD", "LET_AGREED", "LET", "WITHDRAWN"]),
  propertyType: z.enum([
    "APARTMENT", "FLAT", "STUDIO", "TERRACED", "SEMI_DETACHED", "DETACHED",
    "MAISONETTE", "TOWNHOUSE", "BUNGALOW", "PENTHOUSE", "MEWS", "NEW_BUILD",
  ]),
  tenure: z.enum(["FREEHOLD", "LEASEHOLD", "SHARE_OF_FREEHOLD", "COMMONHOLD"]).optional().nullable(),
  price: numberish.int().min(0),
  priceQualifier: z.enum(["GUIDE", "OFFERS_OVER", "OFFERS_IN_EXCESS_OF", "FIXED", "FROM", "POA"]),
  rentFrequency: z.enum(["PCM", "PW"]).optional().nullable(),
  bedrooms: numberish.int().min(0),
  bathrooms: numberish.int().min(0),
  receptions: numberish.int().min(0),
  floorAreaSqft: numberish.int().min(0).optional().nullable(),
  features: z.array(z.string()).default([]),
  chainFree: z.boolean().default(false),
  newBuild: z.boolean().default(false),
  parking: z.boolean().default(false),
  outdoorSpace: z.enum(["NONE", "BALCONY", "PATIO", "GARDEN", "TERRACE", "ROOF_TERRACE", "COMMUNAL_GARDEN"]),
  councilTaxBand: z.string().optional().nullable(),
  epcRating: z.string().optional().nullable(),
  displayAddress: z.string().min(4),
  postcode: z.string().min(2),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;
