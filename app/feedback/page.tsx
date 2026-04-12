"use client"

import { useState } from "react"

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 5
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        setSuccess(true)
        setForm({
          name: "",
          email: "",
          message: "",
          rating: 5
        })
      }

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow"
      >

        <h1 className="text-xl font-bold mb-4">
          Feedback 💬
        </h1>

        <input
          placeholder="Nama (optional)"
          className="border p-2 w-full mb-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email (optional)"
          className="border p-2 w-full mb-3 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
          <option value={4}>⭐⭐⭐⭐ (4)</option>
          <option value={3}>⭐⭐⭐ (3)</option>
          <option value={2}>⭐⭐ (2)</option>
          <option value={1}>⭐ (1)</option>
        </select>

        <textarea
          placeholder="Tulis feedback..."
          className="border p-2 w-full mb-3 rounded"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded"
        >
          {loading ? "Mengirim..." : "Kirim Feedback"}
        </button>

        {success && (
          <p className="text-green-500 text-sm mt-3">
            ✅ Feedback terkirim!
          </p>
        )}

      </form>

    </main>
  )
}