"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import SignupPage from "./Signup"

export function Header() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl">LangkaLoka</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Login</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{""}</DialogTitle>
            </DialogHeader>

            {isLogin ? (
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full">Login</Button>
                <p className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Register
                  </span>
                </p>
              </div>
            ) : (
              <SignupPage />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
