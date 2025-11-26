import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ---- 커스텀 유저 타입 ---- //
interface AuthUser {
  id: string;
  loginId: string;
  email: string;
  name: string;
  isAdmin: string;
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,   
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

        // DB에서 사용자 찾기
        const user = await prisma.user.findUnique({
          where: { loginId: lowerId },
        });

        if (!user) return null;

        // 비밀번호 비교
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ---- 커스텀 타입으로 반환 ---- //
        const authUser: AuthUser = {
          id: user.id,
          loginId: user.loginId,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };

        return authUser;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    
    // JWT 저장 시
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;

        token.id = u.id;
        token.loginId = u.loginId;
        token.email = u.email;
        token.name = u.name;
        token.isAdmin = u.isAdmin;
      }
      return token;
    },

    // session에서 사용자 정보로 변환
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.loginId = token.loginId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  
});


export { handler as GET, handler as POST };
