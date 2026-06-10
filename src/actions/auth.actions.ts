"use server";

import { prisma } from "@/lib/db";
import { forgotPasswordSchema, tokenResetSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(data: unknown) {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { memberId, mobile } = parsed.data;
  const member = await prisma.member.findUnique({ where: { memberId } });
  if (!member || member.mobile !== mobile) {
    return { error: { memberId: ["No account found with this Member ID and mobile."] } };
  }

  await prisma.passwordResetToken.deleteMany({ where: { memberId: member.id } });

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { memberId: member.id, mobile, token, expiresAt },
  });

  return { success: true, token, name: member.name };
}

export async function resetPasswordWithToken(data: unknown) {
  const parsed = tokenResetSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { memberId, token, newPassword } = parsed.data;
  const member = await prisma.member.findUnique({ where: { memberId } });
  if (!member) return { error: { memberId: ["Member not found."] } };

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { memberId: member.id, token, used: false, expiresAt: { gt: new Date() } },
  });
  if (!resetToken) return { error: { token: ["Invalid or expired reset code."] } };

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.member.update({ where: { id: member.id }, data: { passwordHash: hash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
  ]);

  return { success: true };
}
