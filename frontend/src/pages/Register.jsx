import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,  // Added this import
} from "@mui/material";
import axios from "../api/axios";
import zxcvbn from "zxcvbn"; // import password strength lib

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false); // Added loading state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate password strength score (0-4)
  const strength = zxcvbn(form.password);
  const strengthScore = strength.score * 25; // scale 0-100%
  const strengthLabel = ["Too Weak", "Weak", "Fair", "Good", "Strong"][strength.score];

  const isPasswordStrongEnough = strength.score >= 2; // 2 = fair or stronger

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordStrongEnough) {
      setSnack({
        open: true,
        message: "Password is too weak. Please choose a stronger password.",
        severity: "error",
      });
      return;
    }

    setLoading(true);  // Start loading
    try {
      await axios.post("/auth/register", form);
      setSnack({
        open: true,
        message: "✅ Registration successful! Redirecting...",
        severity: "success",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMsg = err?.response?.data?.msg;

      if (errorMsg === "Email already in use") {
        setSnack({
          open: true,
          message: "❌ Email is already registered. Please use another email.",
          severity: "error",
        });
      } else if (errorMsg === "Username already taken") {
        setSnack({
          open: true,
          message: "❌ Username is already taken. Please choose a different username.",
          severity: "error",
        });
      } else {
        setSnack({
          open: true,
          message: errorMsg || "❌ Registration failed. Try again.",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* Password strength bar and label */}
            {form.password && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={strengthScore}
                  sx={{ height: 8, borderRadius: 5 }}
                  color={
                    strength.score < 2
                      ? "error"
                      : strength.score < 3
                      ? "warning"
                      : "success"
                  }
                />
                <Typography
                  variant="caption"
                  color={strength.score < 2 ? "error" : "text.secondary"}
                  mt={1}
                >
                  Strength: {strengthLabel}
                </Typography>
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!isPasswordStrongEnough || loading} // disable on loading
              startIcon={loading ? <CircularProgress size={20} /> : null} // show spinner if loading
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            <Typography variant="body2" textAlign="center" mt={1}>
              Already have an account?{" "}
              <span
                style={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
