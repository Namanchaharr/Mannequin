import { apiClient } from "@/shared/lib";

export async function signup(userData) {
  const response = await apiClient.post("/auth/signup", userData);

  return response.data;
}