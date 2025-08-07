import { createContext, useState, useEffect } from "react";
import axios from "../api/axios"; // ✅ custom instance
import CircularProgress from "@mui/material/CircularProgress"; // ✅ added

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // Simulate loading progress bar
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
    simulateProgress();

    try {
      const res = await axios.get("/auth/me"); // ✅ uses instance with interceptor
      setUser(res.data);
      setLoadingPercent(100);
    } catch (err) {
      console.error("Auth check failed:", err.message);
      setUser(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300); // delay for UI completion
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  // Optional: update user globally
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // optional
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "sans-serif",
            backgroundColor: "#f5f5f5",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <CircularProgress size={100} thickness={5} />
            <img
              src="/favicon.ico" // ✅ logo in public folder
              alt="Logo"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            />
          </div>
          <p style={{ fontSize: "18px", color: "#555" }}>
            Authenticating... {loadingPercent}%
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
