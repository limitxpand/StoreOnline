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

        const requestedRole = credentials.role || "customer";

        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // Auto-create test users for testing convenience
          if (credentials.email === "test@test.com" && credentials.password === "test") {
            const hashedPassword = await bcrypt.hash("test", 10);
            user = await prisma.user.create({
              data: {
                email: "test@test.com",
                password: hashedPassword,
                name: "Test User",
                role: requestedRole
              }
            });
          } else {
            return null;
          }
        } else {
          // Compare password
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            return null;
          }

          // For testing convenience: update the role to whatever they selected on the login page
          if (user.role !== requestedRole) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { role: requestedRole }
            });
          }
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
