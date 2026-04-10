"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import SignupPage from "./Signup"
import { LoginForm } from "./fragments/LoginForm"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export function Header() {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const [isLogin, setIsLogin] = useState(true)

  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  return (
    <header className="border-b">
      <div
        className="
container
max-w-7xl
mx-auto
px-4
md:px-6
py-4
flex
items-center
justify-between
"
      >
        {/* Logo */}
        <button
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          LangkaLoka
        </button>
        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => router.push(`/store-panel`)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Jualan Yuk!
            </button>
          )}

          {/* Wishlist */}
          {user && (
            <Link href="/wishlist">
              <Button variant="outline">❤️ Wishlist</Button>
            </Link>
          )}
          {user && (
            <Link href="/chat">
              <Button>Chat</Button>
            </Link>
          )}
          {/* Login Dialog */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val)
              if (!val) setIsLogin(true)
            }}
          >
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium">Hi {user.email}</span>

                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("token")
                    queryClient.invalidateQueries({ queryKey: ["currentUser"] })
                    router.push("/")
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setOpen(true)}>Login</Button>
            )}

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isLogin ? "Login" : "Create Account"}
                </DialogTitle>
              </DialogHeader>

              {isLogin ? (
                <>
                  <LoginForm onSuccess={() => setOpen(false)} />

                  <p className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <span
                      onClick={() => setIsLogin(false)}
                      className="text-primary cursor-pointer hover:underline"
                    >
                      Register
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <SignupPage
                    onSuccess={() => setIsLogin(true)}
                    onSwitchToLogin={() => setIsLogin(true)}
                  />
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
