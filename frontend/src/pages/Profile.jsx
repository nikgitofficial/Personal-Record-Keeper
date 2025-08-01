import { useState, useContext, useEffect } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePicture = () => {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Cleanup preview URL when image changes or component unmounts
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl("");
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("/api/profile/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update context user profile pic
      setUser((prev) => ({ ...prev, profilePic: res.data.url }));
      setImage(null); // Reset selected image after upload
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={2}>
      <Typography variant="h6">Profile Picture</Typography>
      <Avatar
        alt="Profile"
        src={previewUrl || user?.profilePic}
        sx={{ width: 100, height: 100, margin: "auto", mt: 1 }}
      />
      <Box mt={2}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading || !image}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePicture;
