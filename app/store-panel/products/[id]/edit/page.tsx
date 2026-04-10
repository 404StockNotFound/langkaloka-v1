"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

export default function EditProductPage() {

  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")

  // 🔥 ambil data product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`)
      const p = res.data

      setName(p.name)
      setPrice(p.price)
      setDescription(p.description || "")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  // 🔥 update product
  const handleUpdate = async (e: any) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      await axios.patch(`/api/products/${id}/edit`, {
        name,
        price: Number(price),
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Produk berhasil diupdate")

      router.push("/store-panel/products")

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl font-bold mb-6">
        Edit Produk
      </h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">

        <input
          className="border p-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
        />

        <input
          className="border p-3 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Harga"
        />

        <textarea
          className="border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
        />

        <button className="bg-black text-white py-3 rounded">
          Update Produk
        </button>

      </form>

    </div>
  )
}