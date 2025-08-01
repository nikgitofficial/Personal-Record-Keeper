import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useContext, useRef, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("/profile/upload-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setUser((prev) => ({
        ...prev,
        profilePic: res.data.profilePic,
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5">Your Profile</Typography>
      <Box position="relative" display="inline-block" mt={2}>
        <Avatar
          src={user?.profilePic}
          sx={{ width: 120, height: 120, margin: "auto" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          startIcon={<PhotoCameraIcon />}
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Change Picture"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
