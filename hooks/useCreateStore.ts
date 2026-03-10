import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export const useCreateStore = () => {

  return useMutation({

    mutationFn: async (payload: {
      name: string
      description?: string
    }) => {

      const token = localStorage.getItem("token")

      const { data } = await axios.post(
        "/api/store/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    },

  })

}