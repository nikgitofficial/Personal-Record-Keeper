import { useState, useContext } from "react";
import { Avatar, Button, Box, CircularProgress, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post("/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
      setSelectedImage(null);
    } catch (err) {
      console.error("Upload failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h5">Update Profile Picture</Typography>
      <Avatar
        src={selectedImage ? URL.createObjectURL(selectedImage) : user?.profilePic}
        sx={{ width: 150, height: 150, margin: "20px auto" }}
      />
      <input
        accept="image/*"
        type="file"
        id="upload"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <label htmlFor="upload">
        <Button variant="contained" component="span" startIcon={<PhotoCameraIcon />}>
          Choose Image
        </Button>
      </label>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading || !selectedImage}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile
;
