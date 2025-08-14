import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  AccountCircle,
  Notifications,
  Settings,
  Logout,
} from "@mui/icons-material";
import api from "../api/axios"; // ✅ use central API instance

export default function AdminPage() {
  const [totalUsers, setTotalUsers] = useState(null);
  const [loadingCount, setLoadingCount] = useState(true);
  const [view, setView] = useState("stats");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await api.get("/auth/user-count", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setTotalUsers(res.data.totalUsers);
      } catch (err) {
        console.error("Failed to fetch user count", err);
      } finally {
        setLoadingCount(false);
      }
    };
    fetchUserCount();
  }, []);

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get("/auth/all-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleManageUsers = () => {
    setView("users");
    fetchAllUsers();
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <Box>
            <IconButton color="inherit"><Notifications /></IconButton>
            <IconButton color="inherit"><Settings /></IconButton>
            <IconButton color="inherit"><AccountCircle /></IconButton>
            <IconButton color="inherit"><Logout /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {view === "stats" && (
          <>
            <Typography variant="h4" gutterBottom>Welcome, Admin</Typography>
            <Typography variant="body1" gutterBottom>
              Here’s an overview of your platform’s statistics and recent activity.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {[
                { title: "Total Users", value: loadingCount ? <CircularProgress size={24} /> : totalUsers },
                { title: "Active Sessions", value: "342" },
                { title: "Revenue", value: "$12,530" },
              ].map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2, boxShadow: 3, backgroundColor: "white" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleManageUsers}>
                Manage Users
              </Button>
              <Button variant="outlined" color="secondary">View Reports</Button>
            </Box>
          </>
        )}

        {view === "users" && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5">All Users</Typography>
              <Button variant="outlined" onClick={() => setView("stats")}>
                Back to Dashboard
              </Button>
            </Box>
            {loadingUsers ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
