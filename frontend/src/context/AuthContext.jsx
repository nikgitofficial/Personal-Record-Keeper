import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevent rendering before auth check

  const getMe = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token expired? Try refresh
        try {
          const refreshRes = await axios.get("/auth/refresh", {
            withCredentials: true,
          });

          const newToken = refreshRes.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          const retryRes = await axios.get("/auth/me", {
            headers: { Authorization: `Bearer ${newToken}` },
            withCredentials: true,
          });

          setUser(retryRes.data);
        } catch (refreshErr) {
          console.error("Refresh failed:", refreshErr.message);
          setUser(null);
        }
      } else {
        console.error("Auth error:", err.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  // ✅ Add this function to allow profilePic (or entire user) updates
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // optional: if you're storing user in localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
