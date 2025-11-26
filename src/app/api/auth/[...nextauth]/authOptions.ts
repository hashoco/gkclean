import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        loginId: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.loginId || !credentials.password) return null;

        const lowerId = credentials.loginId.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { loginId: lowerId },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          loginId: user.loginId,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.loginId = (user as any).loginId ?? "";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.isAdmin = (user as any).isAdmin ?? "N";
      }
      return token;
    },

    async session({ session, token }) {
      if (!session.user) session.user = {} as any;

      session.user.id = token.id ? String(token.id) : "";
      session.user.loginId = token.loginId ? String(token.loginId) : "";
      session.user.email = token.email ? String(token.email) : "";
      session.user.name = token.name ? String(token.name) : "";
      session.user.isAdmin = token.isAdmin ? String(token.isAdmin) : "N";

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
``
