// frontend/src/pages/UserInfo.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import {
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";

const UserInfo = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!user) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  const handleSave = () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      setSnackbar({
        open: true,
        message: "Username must be at least 3 characters",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    axios
      .patch("/auth/update-username", { username: newUsername.trim() })
      .then((res) => {
        updateUser(res.data.user);
        setEditMode(false);
        setSnackbar({
          open: true,
          message: "Username updated successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Error updating username:", err.response?.data || err.message);
        setSnackbar({
          open: true,
          message: "Failed to update username",
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0][0];
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={4}
        sx={{ width: "100%", maxWidth: 450, borderRadius: 3, overflow: "hidden" }}
      >
        {/* Header with gradient and avatar */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            color: "#fff",
          }}
        >
          <Avatar
            src={user.avatar || ""}
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
              mb: 2,
              bgcolor: user.avatar ? "transparent" : "#fff",
              color: "#2575fc",
            }}
          >
            {!user.avatar && getInitials(user?.username)}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {user?.username}
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <Divider sx={{ mb: 3 }} />

          {/* Email */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
              {user?.email}
            </Typography>
          </Box>

          {/* Username */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Username
            </Typography>
            {editMode ? (
              <>
                <TextField
                  fullWidth
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ flex: 1 }}
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
                    sx={{ flex: 1 }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Box mt={1} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.username}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setEditMode(true)}
                  sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#2575fc" } }}
                >
                  Edit
                </Button>
              </Box>
            )}
          </Box>

          {/* Snackbar */}
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
        </Box>
      </Paper>
    </Box>
  );
};

export default UserInfo;
