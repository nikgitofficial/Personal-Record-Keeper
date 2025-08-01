import { useState, useContext } from "react";
import axios from "../api/axios";
import {
  Avatar,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const res = await axios.post("/api/profile/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.user);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h5">Profile Picture</Typography>

      <Box position="relative" display="inline-block" mt={2}>
        <Avatar
          src={user?.profilePic}
          alt="Profile"
          sx={{ width: 120, height: 120 }}
        />
        <input
          accept="image/*"
          type="file"
          hidden
          id="upload-profile-pic"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <label htmlFor="upload-profile-pic">
          <IconButton
            component="span"
            sx={{ position: "absolute", bottom: 0, right: 0 }}
          >
            <PhotoCameraIcon />
          </IconButton>
        </label>
      </Box>

      {selectedFile && (
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
