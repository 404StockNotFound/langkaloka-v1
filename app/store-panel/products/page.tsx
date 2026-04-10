"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function SellerProductsPage() {

  const [products, setProducts] = useState<any[]>([])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("/api/seller/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const markAsSold = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      await axios.patch(`/api/products/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Yakin mau hapus produk ini?")) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Produk Saya
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((product) => (

          <div
            key={product.id}
            className="
              border
              rounded-xl
              overflow-hidden
              hover:shadow-lg
              transition
              bg-white
            "
          >

            {/* IMAGE */}
            <div className="relative">

              {product.image ? (
                <img
                  src={product.image}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  No Image
                </div>
              )}

              {/* 🔥 SOLD BADGE */}
              {product.isSold && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  SOLD
                </div>
              )}

            </div>

            {/* CONTENT */}
            <div className="p-3 flex flex-col gap-2">

              <p className="font-semibold text-sm line-clamp-1">
                {product.name}
              </p>

             <p className="font-bold text-sm">
  Rp {product.price?.toLocaleString()}
</p>

{/* BUTTON AREA */}
<div className="flex flex-col gap-2 mt-2">

  {/* 🔥 EDIT */}
  <button
  onClick={() => window.location.href = `/store-panel/products/${product.id}/edit`}
  className="
    w-full
    bg-blue-600
    text-blue
    py-2
    rounded-md
    text-sm
    font-semibold
    hover:bg-blue-700
  "
>
  Edit
</button>

  {/* 🔥 SOLD */}
  {!product.isSold && (
    <button
      onClick={() => markAsSold(product.id)}
      className="
        bg-red-600
        text-white
        py-1.5
        rounded-md
        text-sm
        hover:bg-red-700
      "
    >
      Tandai Terjual
    </button>
  )}

  {/* 🔥 DELETE */}
  <button
    onClick={() => deleteProduct(product.id)}
    className="
      bg-gray-800
      text-white
      py-1.5
      rounded-md
      text-sm
      hover:bg-black
    "
  >
    Hapus
  </button>

</div>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}