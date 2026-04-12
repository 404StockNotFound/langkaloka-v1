import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/mailer"

export async function GET() {
  try {
    await sendEmail(
      "langkaloka.app@gmail.com",
      "Test Email LangkaLoka 🚀",
      "<h1>Email berhasil masuk bro 🔥</h1>"
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}