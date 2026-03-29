"use client"

import { useState } from "react"
import { useCreateStore } from "@/hooks/useCreateStore"
import { Header } from "@/components/views/Header"
import { useRouter } from "next/navigation"

export default function CreateStorePage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const { mutate, isPending } = useCreateStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert("Nama toko wajib diisi")
      return
    }

    mutate(
      { name, description },
      {
        onSuccess: () => {
          alert("Store berhasil dibuat 🎉")
          router.push("/sell")
        },
        onError: (error: any) => {
          alert(
            error?.response?.data?.error ||
            "Gagal membuat toko"
          )
        }
      }
    )
  }

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create Your Store
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            className="border p-3 rounded"
            placeholder="Store name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Store description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <button
            className="bg-black text-white py-3 rounded disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Store"}
          </button>

        </form>

      </div>

    </main>
  )
}