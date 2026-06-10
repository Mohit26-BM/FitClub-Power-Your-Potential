import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user as { role?: string } | null | undefined;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) return user?.role === "admin";
      if (pathname.startsWith("/member")) return user?.role === "member";
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.memberId = (user as { memberId?: string }).memberId;
      }
      return token;
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u = session.user as any;
      u.id = token.sub;
      u.role = token.role;
      u.memberId = token.memberId;
      return session;
    },
  },
  providers: [],
};
