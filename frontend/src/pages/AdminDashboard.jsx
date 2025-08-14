import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  Snackbar,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AccountCircle,
  Notifications,
  Settings,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;

export default function AdminPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("stats");

  const [totalUsers, setTotalUsers] = useState(null);
  const [totalFiles, setTotalFiles] = useState(null);
  const [totalDetails, setTotalDetails] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  };

  // Fetch all stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [userRes, filesRes, detailsRes] = await Promise.all([
  api.get("/auth/user-count", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }),
  api.get("/admin-stats/files-uploaded", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }),
  api.get("/admin-stats/personal-details", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }),
]);

        setTotalUsers(userRes.data.totalUsers);
        setTotalFiles(filesRes.data.totalFiles);
        setTotalDetails(detailsRes.data.totalDetails);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
      setUser(null);
      setLogoutSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => setView("stats")}
          sx={{ borderRadius: 1, "&:hover": { backgroundColor: theme.palette.action.hover } }}
        >
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          onClick={handleManageUsers}
          sx={{ borderRadius: 1, "&:hover": { backgroundColor: theme.palette.action.hover } }}
        >
          <ListItemIcon>
            <PeopleIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", backgroundColor: darkMode ? "#121212" : theme.palette.grey[50] }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: "linear-gradient(to right, #1e3c72, #2a5298)", color: "#fff" }}>
        <Toolbar sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }} aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Box component="img" src="/favicon.ico" alt="Admin Logo" sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap>
              Admin Dashboard
            </Typography>
          </Box>
          {/* Center scrolling text */}
          <Box sx={{ flexGrow: 1, overflow: "hidden", position: "relative", height: { xs: 36, sm: 48 }, mx: 2, minWidth: 0, display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ position: "absolute", top: 0, whiteSpace: "nowrap", animation: "scrollText1 12s linear infinite", fontWeight: 600, color: "#fff" }}>
              Welcome, Admin
            </Typography>
            <Typography sx={{ position: "absolute", top: "1.8rem", whiteSpace: "nowrap", animation: "scrollText2 15s linear infinite", fontWeight: 600, color: "#fff" }}>
              Tip: Monitor users and platform activity efficiently.
            </Typography>
            <style>{`
              @keyframes scrollText1 {0% { transform: translateX(100%); }100% { transform: translateX(-100%); }}
              @keyframes scrollText2 {0% { transform: translateX(100%); }100% { transform: translateX(-100%); }}
            `}</style>
          </Box>
          {/* Right icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", color: "rgba(255,255,255,0.8)" }}>{new Date().toLocaleString()}</Typography>
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
              <IconButton color="inherit" onClick={toggleTheme}>{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
            </Tooltip>
            <Tooltip title="Notifications" arrow><IconButton color="inherit"><Notifications /></IconButton></Tooltip>
            <Tooltip title="Settings" arrow><IconButton color="inherit"><Settings /></IconButton></Tooltip>
            <Tooltip title="Account" arrow><IconButton color="inherit"><AccountCircle /></IconButton></Tooltip>
            <Tooltip title="Logout" arrow><IconButton color="inherit" onClick={handleLogout}><LogoutIcon /></IconButton></Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }} open>{drawer}</Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}>{drawer}</Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {view === "stats" && (
          <>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "#1e3c72" }}>Welcome, Admin</Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">Here’s an overview of your platform’s statistics and recent activity.</Typography>

            <Grid container spacing={3} sx={{ mt: 2, maxWidth: 1000 }} justifyContent="center">
              {[
                { title: "Total Users", value: loadingStats ? <CircularProgress size={24} /> : totalUsers },
                { title: "Total Files Uploaded", value: loadingStats ? <CircularProgress size={24} /> : totalFiles },
                { title: "Total Personal Details", value: loadingStats ? <CircularProgress size={24} /> : totalDetails },
                { title: "Active Sessions", value: "342" },
                { title: "Revenue", value: "$12,530" },
              ].map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", backgroundColor: "#fff", transition: "transform 0.2s ease-in-out", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" } }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>{card.title}</Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Button variant="contained" color="primary" onClick={handleManageUsers}>Manage Users</Button>
              <Button variant="outlined" color="secondary">View Reports</Button>
            </Box>
          </>
        )}

        {view === "users" && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1, width: "100%", maxWidth: 1000 }}>
              <Typography variant="h5" fontWeight="bold">All Users</Typography>
              <Button variant="outlined" onClick={() => setView("stats")}>Back to Dashboard</Button>
            </Box>

            {loadingUsers ? <CircularProgress /> : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", maxWidth: 1000 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}>
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

      <Snackbar open={logoutSnackbarOpen} autoHideDuration={1500} message="Logged out successfully" onClose={() => setLogoutSnackbarOpen(false)} />
    </Box>
  );
}
