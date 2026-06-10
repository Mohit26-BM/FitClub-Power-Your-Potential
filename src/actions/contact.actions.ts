"use server";

import { prisma } from "@/lib/db";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitInquiry(data: ContactInput) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.contactInquiry.create({ data: parsed.data });
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function updateInquiryStatus(id: string, status: string) {
  await prisma.contactInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
  return { success: true };
}
