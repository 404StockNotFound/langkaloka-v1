"use client"

import { Header } from "@/components/views/Header"
import { useFavorites } from "@/hooks/useFavorites"

export default function WishlistPage() {

  const { data: favorites, isLoading } = useFavorites()

  if (isLoading) return <p>Loading...</p>

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          ❤️ My Wishlist
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {favorites?.map((fav:any) => (

            <div
              key={fav.favoriteId}
              className="border rounded-xl overflow-hidden"
            >

              {fav.image ? (

                <img
                  src={fav.image}
                  className="aspect-square w-full object-cover"
                />

              ) : (

                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  No Image
                </div>

              )}

              <div className="p-3">

                <p className="text-sm font-medium">
                  {fav.name}
                </p>

                <p className="font-bold">
                  Rp {fav.price?.toLocaleString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}