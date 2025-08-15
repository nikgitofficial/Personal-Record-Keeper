// frontend/src/pages/UserInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Snackbar, Alert, TextField, Button, Box, Typography, Paper } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch current user info
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then((res) => {
        setUser(res.data);
        setNewUsername(res.data.username);
      })
      .catch((err) => {
        console.error("Error fetching user:", err.response?.data || err.message);
        setSnackbar({ open: true, message: "Failed to load user info", severity: "error" });
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle username update
  const handleSave = () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      setSnackbar({ open: true, message: "Username must be at least 3 characters", severity: "warning" });
      return;
    }

    setLoading(true);
    axios
      .patch(
        `${API_URL}/auth/update-username`,
        { username: newUsername.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      )
      .then((res) => {
        setUser(res.data.user);
        setEditMode(false);
        setSnackbar({ open: true, message: "Username updated successfully", severity: "success" });
      })
      .catch((err) => {
        console.error("Error updating username:", err.response?.data || err.message);
        setSnackbar({ open: true, message: "Failed to update username", severity: "error" });
      })
      .finally(() => setLoading(false));
  };

  if (loading && !user) {
    return <CircularProgress style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 400, margin: "50px auto", padding: 3, backgroundColor: "#fff" }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        User Info
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle1">Email:</Typography>
        <Typography variant="body1">{user?.email}</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Username:</Typography>
        {editMode ? (
          <>
            <TextField
              fullWidth
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loading}
              variant="outlined"
              size="small"
            />
            <Box mt={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditMode(false);
                  setNewUsername(user.username);
                }}
                sx={{ ml: 1 }}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography variant="body1">{user?.username}</Typography>
            <Button variant="text" onClick={() => setEditMode(true)} sx={{ ml: 1 }}>
              Edit
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserInfo;
