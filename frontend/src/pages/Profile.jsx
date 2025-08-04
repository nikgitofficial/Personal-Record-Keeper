import { useState, useContext, useRef } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  Stack,
} from '@mui/material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const fileInputRef = useRef(null);

  const originalPic = user?.profilePic;

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('profilePic', image);

    try {
      setLoading(true);
      const res = await axios.post('/profile/upload-profile-pic', formData);
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setSnackbar({ open: true, message: 'Profile picture updated!' });
      setImage(null); // clear after success
    } catch (error) {
      setSnackbar({ open: true, message: 'Upload failed!' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setUser((prev) => ({ ...prev, profilePic: originalPic }));
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          if (file) {
            const preview = URL.createObjectURL(file);
            setUser((prev) => ({ ...prev, profilePic: preview }));
          }
        }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading || !image}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload Profile Pic'}
        </Button>

        {image && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </Stack>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        autoHideDuration={3000}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      />
    </div>
  );
};

export default Profile;
