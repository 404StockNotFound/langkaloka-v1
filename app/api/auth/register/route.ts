import { users } from "@/db/schema"
import { eq, or } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { email, name, phone, password, address } = body

    // Validate required fields
    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "Email, phone and password are required" },
        { status: 400 }
      )
    }

    // Check if email or phone already exists
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)))
      .limit(1)

    if (existing.length > 0) {
      const isDuplicateEmail = existing[0].email === email

      return NextResponse.json(
        {
          error: isDuplicateEmail
            ? "Email already exists"
            : "Phone already exists",
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: name ?? null,
        phone,
        password: hashedPassword,
        address: address ?? null,
      })
      .returning()

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          address: newUser.address,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER ERROR]", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}