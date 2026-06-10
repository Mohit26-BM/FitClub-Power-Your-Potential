"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calcExpiryDate } from "@/lib/utils";
import { addMemberSchema, updateProfileSchema, changePasswordSchema, resetPasswordSchema, registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Plan } from "@/types";

export async function addMember(formData: unknown) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const parsed = addMemberSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { name, memberId, mobile, password, bmi, joinDate, plan } = parsed.data;

  const exists = await prisma.member.findUnique({ where: { memberId } });
  if (exists) return { error: { memberId: ["Member ID already in use"] } };

  const join = new Date(joinDate);
  const expiry = calcExpiryDate(join, plan);
  const hash = await bcrypt.hash(password, 12);

  await prisma.member.create({
    data: {
      memberId,
      name,
      mobile,
      passwordHash: hash,
      bmi,
      joinDate: join,
      expiryDate: expiry,
      plan,
      feePaid: false,
    },
  });

  revalidatePath("/admin/members");
  return { success: true };
}

export async function deleteMember(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return { error: "Member not found" };

  await prisma.member.delete({ where: { id } });
  revalidatePath("/admin/members");
  return { success: true };
}

export async function toggleFeeStatus(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return { error: "Member not found" };

  await prisma.member.update({
    where: { id },
    data: { feePaid: !member.feePaid },
  });

  revalidatePath("/admin/members");
  return { success: true, feePaid: !member.feePaid };
}

export async function adminResetMemberPassword(memberId: string, data: unknown) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.member.update({
    where: { id: memberId },
    data: { passwordHash: hash },
  });

  return { success: true };
}

export async function updateMemberProfile(data: unknown) {
  const session = await auth();
  if (session?.user?.role !== "member") return { error: "Unauthorized" };

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const updateData: Record<string, unknown> = {};
  if (parsed.data.mobile) updateData.mobile = parsed.data.mobile;
  if (parsed.data.bmi !== undefined) updateData.bmi = parsed.data.bmi;

  if (Object.keys(updateData).length === 0) return { error: "No changes provided" };

  await prisma.member.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/member");
  return { success: true };
}

export async function changeMemberPassword(data: unknown) {
  const session = await auth();
  if (session?.user?.role !== "member") return { error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const member = await prisma.member.findUnique({ where: { id: session.user.id } });
  if (!member) return { error: "Member not found" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, member.passwordHash);
  if (!valid) return { error: { currentPassword: ["Incorrect current password"] } };

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.member.update({ where: { id: session.user.id }, data: { passwordHash: hash } });

  return { success: true };
}

export async function registerMember(formData: unknown) {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { name, memberId, mobile, password, bmi, plan } = parsed.data;

  const exists = await prisma.member.findUnique({ where: { memberId } });
  if (exists) return { error: { memberId: ["Member ID already taken. Choose another."] } };

  const join = new Date();
  const expiry = calcExpiryDate(join, plan as Plan);
  const hash = await bcrypt.hash(password, 12);

  await prisma.member.create({
    data: {
      memberId,
      name,
      mobile,
      passwordHash: hash,
      bmi,
      joinDate: join,
      expiryDate: expiry,
      plan,
      feePaid: false,
    },
  });

  revalidatePath("/admin/members");
  return { success: true };
}

export async function renewMembership(memberId: string, plan: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return { error: "Member not found" };

  const base = member.expiryDate > new Date() ? member.expiryDate : new Date();
  const expiry = calcExpiryDate(base, plan as Plan);

  await prisma.member.update({
    where: { id: memberId },
    data: { plan, expiryDate: expiry, feePaid: true },
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}`);
  return { success: true };
}
