import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { stores } from "@/db/schema"
import { verifyToken } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, location, image } = body

    let imageUrl: string | undefined

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "langkaloka",
      })
      imageUrl = uploaded.secure_url
    }

    const [store] = await db
      .insert(stores)
      .values({
        name,
        description,
        location,
        ownerId: decoded.id,
        ...(imageUrl && { image: imageUrl }),
      })
      .returning()

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
