import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const googleId =
  process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_ID;
const googleSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_SECRET;

const providers = [];

if (googleId && googleSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  );
} else {
  console.warn(
    "[auth] Google OAuth env vars missing (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). Sign-in is disabled; browsing still works."
  );
}

export const authOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async session({ session }) {
      try {
        if (!session?.user?.email) return session;
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.error("session callback:", error.message);
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        if (!profile?.email) return false;
        await connectToDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const base = (profile.name || profile.email.split("@")[0] || "user")
            .replace(/\s+/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "")
            .slice(0, 30);
          const username =
            base.length >= 3 ? base : `user${Date.now().toString().slice(-6)}`;

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists:", error.message);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
