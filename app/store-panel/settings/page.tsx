"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface MeData {
  id: string
  ownerId: string
  name: string
  description: string | null
  image: string | null
  location: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function StoreSettingsPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [me, setMe] = useState<MeData | null>(null)

  // 🔥 ambil data store
  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("/api/store/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const store = res.data

      if (store) {
        setMe(store)
        setName(store.name)
        setDescription(store.description || "")
        setLocation(store.location || "")
      }

      return res.data
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStore()
  }, [])

  const hasStore = !!me

  const router = useRouter()
  // 🔥 update store

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (e: any) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      const imageBase64 = image ? await toBase64(image) : undefined

    await axios.post(
  "/api/store/create",
  {
    name,
    description,
    location,
    image: imageBase64,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

// 🔥 TAMBAH INI
await fetchStore()

      alert(hasStore ? "Toko berhasil diperbarui" : "Toko berhasil dibuat")
      router.push("/store-panel")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        {hasStore ? "Perbarui Toko" : "Buat Toko"}
      </h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          className="border p-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama toko"
        />

        <textarea
          className="border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
        />

        <input
          className="border p-3 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Lokasi"
        />

   <div className="flex items-center gap-4">
  {hasStore && me?.image && (
    <Image
      src={me.image}
      alt="Store Image"
      width={100}
      height={100}
      className="rounded object-cover border"
      unoptimized
    />
  )}

  <input
    type="file"
    accept="image/*"
    className="text-sm"
    onChange={(e) => {
      if (e.target.files) {
        setImage(e.target.files[0])
      }
    }}
  />
</div>
        <button className="bg-black text-white py-3 rounded">
          {hasStore ? "Perbarui" : "Buat"}
        </button>
      </form>
    </div>
  )
}
