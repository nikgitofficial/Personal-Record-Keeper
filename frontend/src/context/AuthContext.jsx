import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevent rendering before auth check
  const [loadingPercent, setLoadingPercent] = useState(0); // NEW: loading progress

  const simulateProgress = () => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      if (percent >= 90) {
        clearInterval(interval);
      } else {
        setLoadingPercent(percent);
      }
    }, 100);
  };

  const getMe = async () => {
    simulateProgress(); // NEW: simulate loading bar

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUser(res.data);
      setLoadingPercent(100); // ✅ done
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
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
          setLoadingPercent(100); // ✅ done
        } catch (refreshErr) {
          console.error("Refresh failed:", refreshErr.message);
          setUser(null);
        }
      } else {
        console.error("Auth error:", err.message);
        setUser(null);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300); // small delay to allow UI to show 100%
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  // ✅ Keep user state updatable from other components
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // optional
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {loading ? (
        // ✅ Optional loading UI
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "sans-serif",
          }}
        >
          <p>Authenticating... {loadingPercent}%</p>
          <progress value={loadingPercent} max="100" style={{ width: "200px" }} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
