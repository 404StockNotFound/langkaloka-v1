"use client"

import { Header } from "@/components/views/Header"
import { useFavorites } from "@/hooks/useFavorites"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const router = useRouter()

  const { data: favorites, isLoading } = useFavorites()

  if (isLoading) return <p>Loading...</p>
  const removeFavorite = async (productId: string) => {
    const token = localStorage.getItem("token")

    if (!token) return

    await axios.delete(`/api/favorites/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // refresh page
    router.refresh()
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">❤️ My Wishlist</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites?.map((fav: any) => (
            <div
              key={fav.favoriteId}
              className="border rounded-xl overflow-hidden"
            >
              {fav.image ? (
                <Image
                  src={fav.image}
                  className="aspect-square w-full object-cover"
                  alt={fav.name}
                  width={400}
                  height={400}
                />
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-3">
                <p className="text-sm font-medium">{fav.name}</p>

                <p className="font-bold">Rp {fav.price?.toLocaleString()}</p>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFavorite(fav.productId)}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
