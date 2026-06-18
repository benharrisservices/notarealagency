import { prisma } from "./prisma";
import type { z } from "zod";
import type { enquirySchema } from "./validation";

export async function createEnquiry(data: z.infer<typeof enquirySchema>) {
  return prisma.enquiry.create({
    data: {
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      propertyId: data.propertyId || null,
    },
  });
}

export async function listEnquiries() {
  return prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
    take: 200,
  });
}

export async function setEnquiryStatus(id: string, status: "NEW" | "IN_PROGRESS" | "CLOSED") {
  return prisma.enquiry.update({ where: { id }, data: { status } });
}
