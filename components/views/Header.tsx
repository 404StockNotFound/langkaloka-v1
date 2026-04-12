"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import SignupPage from "./Signup"
import { LoginForm } from "./fragments/LoginForm"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Pusher from "pusher-js"

export function Header() {
  const router = useRouter()
  const { data: user, isLoading } = useCurrentUser()

  const [isLogin, setIsLogin] = useState(true)
  const [open, setOpen] = useState(false)
  const [notif, setNotif] = useState(0)

  const queryClient = useQueryClient()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastEventRef = useRef<string | null>(null)

  // 🔥 INIT AUDIO
  useEffect(() => {
    audioRef.current = new Audio("/notif.mp3")
    audioRef.current.volume = 0.5
  }, [])

  // 🔥 UNLOCK AUDIO
  useEffect(() => {
    const unlock = () => {
      if (audioRef.current) {
        audioRef.current.muted = true
        audioRef.current.play().catch(() => {})
      }
    }

    document.addEventListener("click", unlock, { once: true })
    return () => document.removeEventListener("click", unlock)
  }, [])

  // 🟢 ONLINE PING
  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem("token")
    if (!token) return

    const sendPing = () => {
      fetch("/api/user/online", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    sendPing()
    const interval = setInterval(sendPing, 10000)

    return () => clearInterval(interval)
  }, [user])

  // 🔥 PUSHER
  useEffect(() => {
    if (!user) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("chat-list")

    channel.bind("update", (data: any) => {
      const myId = localStorage.getItem("userId")

      if (data.senderId === myId) return
      if (!data.text) return

      const currentChatId = window.location.pathname.split("/chat/")[1]
      if (currentChatId === data.chatId) return

      const eventKey = `${data.chatId}-${data.text}`
      if (lastEventRef.current === eventKey) return

      lastEventRef.current = eventKey

      setNotif((prev) => prev + 1)

      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
      }
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [user])

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <button
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          LangkaLoka
        </button>

        <div className="flex items-center gap-4">

          {isLoading ? (
            <div className="w-[120px] h-[36px] bg-gray-200 animate-pulse rounded" />
          ) : (
            <>
              {user && (
                <button
                  onClick={() => router.push(`/store-panel`)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                >
                  Jualan Yuk!
                </button>
              )}
              {user && (
  <button
    onClick={() => router.push("/feedback")}
    className="px-4 py-2 bg-white border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
  >
    Feedback
  </button>
)}

              {user && (
                <Link href="/wishlist">
                  <Button variant="outline">❤️ Wishlist</Button>
                </Link>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => {
                      router.push("/chat")
                      setNotif(0)
                    }}
                    className="px-4 py-2 bg-black text-white rounded-lg"
                  >
                    Chat
                  </button>

                  {notif > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {notif}
                    </span>
                  )}
                </div>
              )}

              {/* 🔐 LOGIN */}
              <Dialog open={open} onOpenChange={setOpen}>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Hi {user.email}</span>

                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("userId")

                        queryClient.invalidateQueries({
                          queryKey: ["currentUser"],
                        })

                        router.push("/")
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setOpen(true)}>Login</Button>
                )}

                {/* 🔥 INI YANG TADI HILANG */}
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
                    <SignupPage
                      onSuccess={() => setIsLogin(true)}
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  )}
                </DialogContent>
              </Dialog>

            </>
          )}

        </div>
      </div>
    </header>
  )
}