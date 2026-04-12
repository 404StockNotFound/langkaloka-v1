import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message, rating } = body

    if (!message) {
      return NextResponse.json({ error: "Message wajib diisi" }, { status: 400 })
    }

    // ✨ EMAIL DESIGN BARU (PRO)
    const html = `
      <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px">
        
        <div style="max-width:500px;margin:auto;background:white;border-radius:12px;padding:20px">

          <h2 style="margin:0;color:#111">
            📩 Feedback Baru
          </h2>

          <p style="color:#666;margin-top:8px">
            Ada feedback baru dari user LangkaLoka
          </p>

          <hr style="margin:16px 0"/>

          <p><b>👤 Nama:</b><br/> ${name || "-"}</p>
          <p><b>📧 Email:</b><br/> ${email || "-"}</p>
          <p><b>⭐ Rating:</b><br/> ${rating || "-"}/5</p>

          <div style="margin-top:16px;background:#f3f4f6;padding:12px;border-radius:8px">
            <p style="margin:0;color:#111">
              ${message}
            </p>
          </div>

          <p style="margin-top:20px;font-size:12px;color:#999;text-align:center">
            ${new Date().toLocaleString()}
          </p>

        </div>

      </div>
    `

    // 🔥 KIRIM EMAIL
    await sendEmail(
      process.env.EMAIL_USER!,
      "📩 Feedback Baru - LangkaLoka",
      html
    )

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Gagal kirim feedback" }, { status: 500 })
  }
}