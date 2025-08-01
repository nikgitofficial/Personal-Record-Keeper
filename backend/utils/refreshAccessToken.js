import axios from "../api/axios";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true, 
    });

    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } else {
      throw new Error("No access token returned");
    }
  } catch (err) {
    console.error("Failed to refresh token:", err.response?.data || err.message);
    return null;
  }
};
