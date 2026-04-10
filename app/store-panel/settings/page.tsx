"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function StoreSettingsPage() {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState<File | null>(null)

  // 🔥 ambil data store
  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("/api/store/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const store = res.data

      setName(store.name)
      setDescription(store.description || "")
      setLocation(store.location || "")

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchStore()
  }, [])

  const router = useRouter()
  // 🔥 update store
const handleUpdate = async (e: any) => {
  e.preventDefault()

  try {
    const token = localStorage.getItem("token")

    let imageUrl = null

    // 🔥 upload ke cloudinary dulu
    if (image) {
      const reader = new FileReader()

      reader.readAsDataURL(image)

      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
      })

      const uploadRes = await axios.post("/api/upload", {
        image: base64
      })

      imageUrl = uploadRes.data.url
    }

    await axios.patch("/api/store/me", {
      name,
      description,
      location,
      image: imageUrl // 🔥 kirim ke backend
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    alert("Toko berhasil diupdate")
    router.push("/store-panel")

  } catch (error) {
    console.error(error)
  }
}

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl font-bold mb-6">
        Setting Toko
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0])
            }
          }}
        />

        <button className="bg-black text-white py-3 rounded">
          Simpan
        </button>

      </form>

    </div>
  )
}