"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { adminPasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function changeAdminPassword(data: unknown) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const parsed = adminPasswordSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const admin = await prisma.admin.findUnique({ where: { username: "admin" } });
  if (!admin) return { error: "Admin not found" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!valid) return { error: { currentPassword: ["Incorrect current password"] } };

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: hash } });

  return { success: true };
}
