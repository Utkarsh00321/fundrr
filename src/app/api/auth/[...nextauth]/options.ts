import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";

interface NextAuthOptions {
  providers: any[];
  callbacks: {};
  pages: {};
  session: {};
  secret?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { username: credentials.indentifier },
              { email: credentials.indentifier },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcryptjs.compare(
            user.password,
            credentials.password,
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    // Callback to modify the JWT token

    async jwt({ token, user }: any) {
      if (user) {
        // Add fields from the user to the token
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.verificationCode = user.verificationCode;
        token.profilePicture = user.profilePicture;
        token.bio = user.bio;
      }
      return token;
    },
    // Modify the session object to include token information
    async session({ session, token }: any) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.profilePicture = token.profilePicture;
        session.user.bio = token.bio;
      }
      return session;
    },
  },
  pages: {
    signIn: "sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env?.AUTH_SECRET,
};
