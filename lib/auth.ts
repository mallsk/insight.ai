import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser } from "./db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleId = profile.sub!;
        const name = profile.name!;
        const email = profile.email!;
        const image = profile.image!;

        await createUser({googleId,name,email,image})

        token.googleId = googleId;
        token.name = name;
        token.email = email;
      }
      // console.log("JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.googleId = token.googleId as string;
      }
      // console.log("Session:", session);
      return session;
    },
  },
};

export default authOptions;