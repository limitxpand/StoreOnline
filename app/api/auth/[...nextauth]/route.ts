import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Support login via email OR username (for admin)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email }
            ]
          },
        });

        if (!user) {
          return null;
        }

        // Compare password:
        // Support unhashed password matching specifically for the seeded admin user
        let isMatch = false;
        if (user.role === 'admin') {
          isMatch = user.password === credentials.password;
        } else {
          isMatch = await bcrypt.compare(credentials.password, user.password);
        }
        
        if (!isMatch) {
          return null;
        }

        if (!user.isVerified && user.role !== 'admin') {
          throw new Error('Please verify your email address to log in.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Custom role
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_testing",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
