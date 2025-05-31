import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // Debug: log user object to verify createdAt
      console.log("Register user data:", data.user);

      // Ensure createdAt exists; fallback to null if undefined
      const userWithCreatedAt = {
        ...data.user,
        createdAt: data.user.createdAt || null,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userWithCreatedAt));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: userWithCreatedAt, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // Debug: log user object to verify createdAt
      console.log("Login user data:", data.user);

      // Ensure createdAt exists; fallback to null if undefined
      const userWithCreatedAt = {
        ...data.user,
        createdAt: data.user.createdAt || null,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userWithCreatedAt));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: userWithCreatedAt, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log("Auth check failed", error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
