import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
  address?: string
}

export interface RegisterResponse {
  message: string
  token: string
  user: {
    id: string
    email: string
    name: string
    phone: string
    address: string
    storeId: string | null
  }
}

export const useRegister = () => {
  const registerUser = async (
    payload: RegisterPayload,
  ): Promise<RegisterResponse> => {
    const { data } = await axios.post("/api/auth/register", payload)
    return data
  }

  return useMutation<RegisterResponse, AxiosError<Error>, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
    },
    onError: (err) => {
      console.error("Register failed:", err)
    },
  })
}
