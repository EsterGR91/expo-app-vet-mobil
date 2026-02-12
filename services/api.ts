import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://backend-adyb.onrender.com";

export const apiFetch = async (endpoint: string, options: any = {}) => {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error");
  }

  return data;
};
