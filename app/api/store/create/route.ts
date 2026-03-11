import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { stores } from "@/db/schema"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {

    const body = await req.json()
    const { name, description } = body

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyToken(token)

if (!decoded) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

    const [store] = await db.insert(stores).values({
  name,
  description,
  ownerId: decoded.id,
}).returning()

    return NextResponse.json(store)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    )
  }
}