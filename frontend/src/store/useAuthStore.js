import axios from "axios";
import { create } from "zustand";

const API_URL = "http:localhost:5000/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: true,

    signup: async (name, email, password) => {
        set({isLoading: true, error: null});
        try{
          const response = await axios.post(`${API_URL}/signup`, {name, email, password});
          set({user: response.data.user, isAuthenticated: true, isLoading: false});
        }catch(error) {
          set({error: error.response.data.message, isLoading: false});
        }
    },

    verifyEmail: async (verificationCode) => {
        set({isLoading: true, erro: null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {verificationCode});
            set({user : response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch (error) {
            set({error: error.response.data.message || "Invalid code :(", isLoading: false});
            throw error;
        }
    }
})))
