import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      googleId: string;
    };
  }

  interface User {
    id: number;
    googleId: string;
    email: string;
    name: string;
    image?: string;
  }
}