import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import {
  AppBar,
  Avatar,
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
  TextField,
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

const drawerWidth = 260;

export default function AdminPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("stats");

  const [totalUsers, setTotalUsers] = useState(null);
  const [totalFiles, setTotalFiles] = useState(null);
  const [totalDetails, setTotalDetails] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [personalDetails, setPersonalDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  // New state for search/filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  };

  const handleOpenProfile = () => navigate("/profile");

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await api.get("/admin-stats/dashboard-stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setTotalUsers(res.data.totalUsers);
        setTotalFiles(res.data.totalFiles);
        setTotalDetails(res.data.totalDetails);
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
    setSearchQuery("");
    fetchAllUsers();
  };

  const fetchAllFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await api.get("/admin-stats/files-list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setFiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchAllPersonalDetailsList = async () => {
    setLoadingDetails(true);
    try {
      const res = await api.get("/admin-stats/personal-details-list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setPersonalDetails(res.data || []);
    } catch (err) {
      console.error("Failed to fetch personal details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleManageFiles = () => {
    setView("files");
    setSearchQuery("");
    fetchAllFiles();
  };

  const handleManagePersonalDetails = () => {
    setView("details");
    setSearchQuery("");
    fetchAllPersonalDetailsList();
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
    <Box sx={{ pt: { xs: 8, sm: 8 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <IconButton
        onClick={handleOpenProfile}
        sx={{
          p: 0,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            bgcolor: "action.hover",
          },
        }}
      >
        <Avatar
          src={user?.profilePic || ""}
          alt={user?.username}
          sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, fontSize: { xs: 24, sm: 32 }, bgcolor: "primary.main" }}
        >
          {!user?.profilePic && (user?.username?.[0]?.toUpperCase() || "U")}
        </Avatar>
      </IconButton>

      <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2", mt: 1, textAlign: "center" }}>
        {user?.username || "Admin"}
      </Typography>

      <Divider sx={{ width: "90%", my: 2 }} />

      <List sx={{ width: "100%" }}>
        <ListItem
          onClick={() => setView("stats")}
          sx={{
            borderRadius: 1,
            "&:hover": { backgroundColor: theme.palette.action.hover },
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          onClick={handleManageUsers}
          sx={{
            borderRadius: 1,
            "&:hover": { backgroundColor: theme.palette.action.hover },
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <ListItemIcon>
            <PeopleIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </Box>
  );

  // Function to filter data based on searchQuery
  const filterData = (data) => {
    if (!searchQuery) return data;

    const q = searchQuery.toLowerCase();
    return data.filter((item) => {
      if (view === "users") {
        return (
          item.username.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q)
        );
      } else if (view === "files") {
        return (
          item.originalName.toLowerCase().includes(q) ||
          (item.description?.toLowerCase() || "").includes(q) ||
          (item.uploadedBy?.username?.toLowerCase() || "").includes(q)
        );
      } else if (view === "details") {
        return (
          item.fullName.toLowerCase().includes(q) ||
          item.birthdate.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.phoneNumber?.toLowerCase() || "").includes(q) ||
          (item.email?.toLowerCase() || "").includes(q)
        );
      }
      return false;
    });
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: darkMode ? "#121212" : theme.palette.grey[50], minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #1e3c72, #2a5298)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Box component="img" src="/favicon.ico" alt="Admin Logo" sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap>
              Admin Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", color: "rgba(255,255,255,0.8)" }}>
              {new Date().toLocaleString()}
            </Typography>
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications" arrow>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings" arrow>
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account" arrow>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout" arrow>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, borderRight: "1px solid rgba(0,0,0,0.05)" },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {view === "stats" && (
          <>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#1e3c72" }}>
              Welcome, Admin
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center", maxWidth: 700 }}>
              Here’s an overview of your platform’s statistics and recent activity.
            </Typography>

            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1100 }}>
              {[
                { title: "Total Users", value: totalUsers },
                { title: "Total Files Uploaded", value: totalFiles },
                { title: "Total Personal Details", value: totalDetails },
              ].map((card, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3">{loadingStats ? <CircularProgress size={36} /> : card.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 4 }}>
              <Button variant="contained" color="primary" onClick={handleManageUsers}>
                Manage Users
              </Button>
              <Button variant="contained" color="secondary" onClick={handleManageFiles}>
                Manage Files
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleManagePersonalDetails}>
                Manage Personal Details
              </Button>
            </Box>
          </>
        )}

        {/* Tables for Users, Files, Personal Details */}
        {["users", "files", "details"].includes(view) && (
          <Box sx={{ width: "100%", maxWidth: 1100 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {view === "users"
                  ? "All Users"
                  : view === "files"
                  ? "All Files"
                  : "All Personal Details"}
              </Typography>

              {/* Search Input */}
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: 200 }}
              />

              <Button variant="outlined" onClick={() => setView("stats")}>
                Back to Dashboard
              </Button>
            </Box>

            {(view === "users" && loadingUsers) ||
            (view === "files" && loadingFiles) ||
            (view === "details" && loadingDetails) ? (
              <CircularProgress />
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  overflowX: "auto",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      {view === "users" && (
                        <>
                          <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                        </>
                      )}
                      {view === "files" && (
                        <>
                          <TableCell sx={{ fontWeight: "bold" }}>File Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Uploaded By</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Uploaded At</TableCell>
                        </>
                      )}
                      {view === "details" && (
                        <>
                          <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Birthdate</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterData(view === "users" ? users : view === "files" ? files : personalDetails).map(
                      (item) => {
                        if (view === "users") {
                          return (
                            <TableRow key={item._id} sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}>
                              <TableCell>{item.username}</TableCell>
                              <TableCell>{item.email}</TableCell>
                              <TableCell>{item.role}</TableCell>
                              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          );
                        } else if (view === "files") {
                          return (
                            <TableRow key={item._id} sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}>
                              <TableCell>{item.originalName}</TableCell>
                              <TableCell>{item.description || "-"}</TableCell>
                              <TableCell>{item.uploadedBy?.username || "-"}</TableCell>
                              <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                          );
                        } else {
                          return (
                            <TableRow key={item._id} sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}>
                              <TableCell>{item.fullName}</TableCell>
                              <TableCell>{item.birthdate}</TableCell>
                              <TableCell>{item.address}</TableCell>
                              <TableCell>{item.phoneNumber || "-"}</TableCell>
                              <TableCell>{item.email || "-"}</TableCell>
                            </TableRow>
                          );
                        }
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Box>

      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={1500}
        message="Logged out successfully"
        onClose={() => setLogoutSnackbarOpen(false)}
      />
      <Snackbar
  open={logoutSnackbarOpen}
  autoHideDuration={1500}
  onClose={() => setLogoutSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setLogoutSnackbarOpen(false)}
    severity="success"
    sx={{ width: "100%" }}
    variant="filled"
  >
    Logged out successfully!
  </Alert>
</Snackbar>
    </Box>
  );
}
