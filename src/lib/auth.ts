import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "member";
      memberId?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: "admin" | "member";
    memberId?: string;
  }
}

const credentialsSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  loginType: z.enum(["admin", "member"]),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
        loginType: {},
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { identifier, password, loginType } = parsed.data;

        if (loginType === "admin") {
          const admin = await prisma.admin.findUnique({
            where: { username: identifier },
          });
          if (!admin) return null;
          const valid = await bcrypt.compare(password, admin.passwordHash);
          if (!valid) return null;
          return {
            id: admin.id,
            name: "Admin",
            email: "admin@gymapp.local",
            role: "admin" as const,
          };
        }

        const member = await prisma.member.findUnique({
          where: { memberId: identifier },
        });
        if (!member) return null;
        const valid = await bcrypt.compare(password, member.passwordHash);
        if (!valid) return null;
        return {
          id: member.id,
          name: member.name,
          email: member.memberId,
          role: "member" as const,
          memberId: member.memberId,
        };
      },
    }),
  ],
});
