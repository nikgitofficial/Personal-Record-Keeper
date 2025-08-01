import React, { useContext, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post("/profile-pic/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setUser((prev) => ({
        ...prev,
        profilePicUrl: res.data.profilePicUrl,
      }));
      setMessage("Profile picture updated!");
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={user?.profilePicUrl}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {user?.username}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <IconButton
            color="primary"
            onClick={() => fileInputRef.current.click()}
          >
            <PhotoCameraIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!image || loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
          {message && (
            <Typography color="primary" mt={2}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
