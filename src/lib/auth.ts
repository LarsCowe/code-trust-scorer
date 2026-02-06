import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signInSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validated = signInSchema.safeParse(credentials);
          if (!validated.success) {
            return null;
          }

          const { email, password } = validated.data;

          // Find user by email
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify password
          const isValid = user.passwordHash === hashPassword(password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth, create user if doesn't exist
      if (account?.provider === "github" && user.email) {
        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email),
          });

          if (!existingUser) {
            const [newUser] = await db
              .insert(users)
              .values({
                email: user.email,
                name: user.name ?? user.email.split("@")[0] ?? "User",
                avatarUrl: user.image ?? null,
                githubId: account.providerAccountId,
                emailVerified: true,
                plan: "free",
              })
              .returning();
            
            if (newUser) {
              user.id = newUser.id;
            }
          } else {
            user.id = existingUser.id;
            // Update GitHub ID if not set
            if (!existingUser.githubId) {
              await db
                .update(users)
                .set({ 
                  githubId: account.providerAccountId,
                  avatarUrl: user.image ?? existingUser.avatarUrl,
                })
                .where(eq(users.id, existingUser.id));
            }
          }
        } catch {
          return false;
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      // Update last login time
      if (user.id) {
        try {
          await db
            .update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, user.id));
        } catch {
          // Silently fail - not critical
        }
      }
    },
  },
});

// Simple hash function for demo purposes
// In production, use bcrypt
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export { hashPassword };

// Type augmentation for next-auth
declare module "next-auth" {
  interface User {
    id?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }
}

// JWT type is extended in callbacks
