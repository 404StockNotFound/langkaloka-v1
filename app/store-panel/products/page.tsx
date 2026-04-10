"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SellerProductsPage() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("/api/seller/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [])

  const markAsSoldorUnsold = async (id: string, value: boolean) => {
    try {
      const token = localStorage.getItem("token")

      await axios.patch(
        `/api/products/${id}`,
        {
          isSold: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

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
          Authorization: `Bearer ${token}`,
        },
      })

      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Produk Saya</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products?.map((product) => (
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
                <Image
                  src={product?.image ?? ("" as string)}
                  alt={product.name}
                  width={400}
                  height={400}
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
                  onClick={() =>
                    router.push(`/store-panel/products/${product.id}/edit`)
                  }
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
                    onClick={() => markAsSoldorUnsold(product.id, true)}
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

                {product.isSold && (
                  <button
                    onClick={() => markAsSoldorUnsold(product.id, false)}
                    className="
        bg-green-500
        text-white
        py-1.5
        rounded-md
        text-sm
        hover:bg-green-700
      "
                  >
                    Batalkan Tandai Terjual
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
