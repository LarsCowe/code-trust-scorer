import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signUpSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid request body",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, name, password } = result.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Conflict", message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = hashPassword(password);

    // Create the user
    const [user] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        emailVerified: false,
        plan: "free",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });

    return NextResponse.json({
      user,
      message: "Account created successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
