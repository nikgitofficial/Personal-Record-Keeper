import { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from '@mui/material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('profilePic', image);

    try {
      setLoading(true);
      const res = await axios.post('/profile/upload-profile-pic', formData);
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setSnackbar({ open: true, message: 'Profile picture updated!' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Upload failed!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Profile Picture
      </Typography>

      <Avatar
        src={user.profilePic}
        alt="Profile"
        sx={{ width: 120, height: 120, mb: 2 }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={loading || !image}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload Profile Pic'}
      </Button>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        autoHideDuration={3000}
        message={snackbar.message}
      />
    </div>
  );
};

export default Profile;
