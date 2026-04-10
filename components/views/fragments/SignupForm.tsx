"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRegister } from "@/hooks/useRegister"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

type RegisterForm = {
  name: string
  email: string
  phone: string
  password: string
}

export function SignupForm({
  className,
  onSuccess,
  onSwitchToLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}) {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const validate = (currentForm = form) => {
    const newErrors = { name: "", email: "", phone: "", password: "" }

    if (!currentForm.name.trim()) {
      newErrors.name = "Nama wajib diisi"
    } else if (currentForm.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter"
    }

    if (!currentForm.email) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!currentForm.phone) {
      newErrors.phone = "Nomor HP wajib diisi"
    } else if (!/^(\+62|62|0)[0-9]{8,12}$/.test(currentForm.phone)) {
      newErrors.phone = "Format nomor HP tidak valid"
    }

    if (!currentForm.password) {
      newErrors.password = "Password wajib diisi"
    } else if (currentForm.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter"
    } else if (!/[A-Z]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada huruf kapital"
    } else if (!/[a-z]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada huruf kecil"
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(currentForm.password)) {
      newErrors.password = "Password harus ada simbol"
    } else if (!/\d/.test(currentForm.password)) {
      newErrors.password = "Password harus ada angka"
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((e) => !e)
  }

  const { mutate, isPending } = useRegister({
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    mutate(form)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.id]: e.target.value }
    setForm(updated)
    validate(updated)
  }

  const isFormValid =
    Object.values(form).every(Boolean) && Object.values(errors).every((e) => !e)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+6285xxxx"
                  required
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isPending || !isFormValid}>
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <span
                    onClick={onSwitchToLogin}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
