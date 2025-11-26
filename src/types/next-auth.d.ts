import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      loginId: string;
      email: string;
      name: string;
      isAdmin: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    loginId: string;
    email: string;
    name: string;
    isAdmin: string;
  }
}
