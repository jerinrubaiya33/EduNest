//frontend/context/auth-context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Restore from localStorage ONCE
  useEffect(() => {
    const saved = localStorage.getItem("eduNestCurrentUser");
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
    setAuthLoading(false);
  }, []);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("eduNestCurrentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("eduNestCurrentUser");
    }
  }, [currentUser]);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleRegisterUser(data) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return { success: false, message: "All fields are required" };
    }
    if (!isValidEmail(email)) {
      return { success: false, message: "Invalid email format!" };
    }
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters!" };
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", { name, email, password });
      setLoading(false);

      if (response?.data?.success) {
        return { success: true, message: response.data.message || "Registered" };
      }
      return { success: false, message: response?.data?.message || "Registration failed" };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }

  async function handleLoginUser(email, password) {
    if (!email || !password) {
      return { success: false, message: "Email and password required" };
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/signin", { email, password });
      setLoading(false);

      if (response?.data?.success) {
        const user = response.data.user;

        // ensure we have role
        if (!user.role) {
          console.error("❌ BACKEND DID NOT SEND ROLE!");
        }

        setCurrentUser(user);

        if (response.data.token) {
          localStorage.setItem("eduNestToken", response.data.token);
        }

        return { success: true, message: response.data.message || "Logged in" };
      }

      return { success: false, message: response?.data?.message || "Login failed" };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("eduNestToken");
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        loading,
        handleRegisterUser,
        handleLoginUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
