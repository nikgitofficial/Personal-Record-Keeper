import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
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
  Alert,
  Skeleton,
  Chip,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  AccountCircle,
  Notifications,
  Settings,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 260;

// ---- Reusable, lightweight components ----
const StatCard = ({ title, value, icon: Icon, loading }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
            theme.palette.primary.light,
            0.12
          )} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: "transform .25s ease, box-shadow .25s ease",
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 12px 36px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
          }}
        >
          {Icon ? <Icon /> : <DashboardIcon />}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {loading ? <Skeleton width={80} height={38} /> : value ?? "—"}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const EmptyState = ({ title = "No data", subtitle = "Try adjusting your search or refresh.", icon: Icon = DescriptionIcon }) => (
  <Box sx={{ textAlign: "center", py: 8 }}>
    <Box sx={{ display: "inline-grid", placeItems: "center", width: 80, height: 80, borderRadius: 3, mb: 2, bgcolor: (t) => alpha(t.palette.text.primary, 0.06) }}>
      <Icon fontSize="large" />
    </Box>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
  </Box>
);

export default function AdminPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("stats");

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Stats
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalFiles, setTotalFiles] = useState(null);
  const [totalDetails, setTotalDetails] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Files
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Personal details
  const [personalDetails, setPersonalDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  // Theme toggle (keeps your existing approach)
  const [darkMode, setDarkMode] = useState(false);

  // search/filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

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

  const handleManageUsers = () => {
    setView("users");
    setSearchQuery("");
    fetchAllUsers();
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
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }
  };

  // Filter helper
  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return view === "users" ? users : view === "files" ? files : personalDetails;

    const source = view === "users" ? users : view === "files" ? files : personalDetails;

    return source.filter((item) => {
      if (view === "users") {
        return (
          item.username?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.role?.toLowerCase().includes(q)
        );
      }
      if (view === "files") {
        return (
          item.originalName?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.uploadedBy?.username?.toLowerCase().includes(q)
        );
      }
      // details
      return (
        item.fullName?.toLowerCase().includes(q) ||
        item.birthdate?.toLowerCase().includes(q) ||
        item.address?.toLowerCase().includes(q) ||
        item.phoneNumber?.toLowerCase?.().includes(q) ||
        item.email?.toLowerCase?.().includes(q)
      );
    });
  }, [searchQuery, users, files, personalDetails, view]);

  // Drawer content
  const drawer = (
    <Box sx={{ pt: { xs: 8, sm: 8 }, display: "flex", flexDirection: "column", height: 1 }}>
      <Box sx={{ display: "grid", placeItems: "center" }}>
        <IconButton
          onClick={handleOpenProfile}
          sx={{
            p: 0,
            borderRadius: "50%",
            overflow: "hidden",
            border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.2)}`,
            transition: "transform 0.2s, box-shadow 0.2s",
            '&:hover': {
              transform: 'scale(1.04)',
              boxShadow: (t) => `0 10px 24px ${alpha(t.palette.common.black, 0.15)}`,
            },
          }}
        >
          <Avatar
            src={user?.profilePic || ""}
            alt={user?.username}
            sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}
          >
            {!user?.profilePic && (user?.username?.[0]?.toUpperCase() || "U")}
          </Avatar>
        </IconButton>
        <Typography variant="h6" fontWeight={800} sx={{ mt: 1, textAlign: "center" }}>
          {user?.username || "Admin"}
        </Typography>
        <Chip label="Administrator" size="small" sx={{ mt: 0.5 }} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 1 }}>
        <ListItem
          onClick={() => setView("stats")}
          sx={{ borderRadius: 1.5, '&:hover': { backgroundColor: (t) => t.palette.action.hover }, cursor: 'pointer' }}
        >
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          onClick={handleManageUsers}
          sx={{ borderRadius: 1.5, '&:hover': { backgroundColor: (t) => t.palette.action.hover }, cursor: 'pointer' }}
        >
          <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>

        <ListItem
          onClick={handleManageFiles}
          sx={{ borderRadius: 1.5, '&:hover': { backgroundColor: (t) => t.palette.action.hover }, cursor: 'pointer' }}
        >
          <ListItemIcon><FolderIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Files" />
        </ListItem>

        <ListItem
          onClick={handleManagePersonalDetails}
          sx={{ borderRadius: 1.5, '&:hover': { backgroundColor: (t) => t.palette.action.hover }, cursor: 'pointer' }}
        >
          <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Personal Details" />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', pb: 2 }}>
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" arrow>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout" arrow>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // Column configs for the table
  const tableConfig = useMemo(() => {
    if (view === 'users') {
      return {
        loading: loadingUsers,
        rows: filteredRows,
        columns: [
          { key: 'username', label: 'Username' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'createdAt', label: 'Created At', render: (v) => new Date(v).toLocaleDateString() },
        ],
      };
    }
    if (view === 'files') {
      return {
        loading: loadingFiles,
        rows: filteredRows,
        columns: [
          { key: 'originalName', label: 'File Name' },
          { key: 'description', label: 'Description', render: (v) => v || '-' },
          { key: 'uploadedBy', label: 'Uploaded By', render: (v) => v?.username || '-' },
          { key: 'createdAt', label: 'Uploaded At', render: (v) => new Date(v).toLocaleString() },
        ],
      };
    }
    // details
    return {
      loading: loadingDetails,
      rows: filteredRows,
      columns: [
        { key: 'fullName', label: 'Full Name' },
        { key: 'birthdate', label: 'Birthdate' },
        { key: 'address', label: 'Address' },
        { key: 'phoneNumber', label: 'Phone' },
        { key: 'email', label: 'Email' },
      ],
    };
  }, [view, filteredRows, loadingUsers, loadingFiles, loadingDetails]);

  return (
    <Box sx={{ display: "flex", backgroundColor: darkMode ? "#0e0e12" : theme.palette.grey[50], minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: (t) => `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
          boxShadow: (t) => `0 4px 12px ${alpha(t.palette.common.black, 0.18)}`,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { sm: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Box component="img" src="/favicon.ico" alt="Admin Logo" sx={{ width: 28, height: 28, mr: 1, borderRadius: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
              Admin Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Chip size="small" label={now.toLocaleString()} sx={{ bgcolor: alpha('#fff', 0.15), color: '#fff' }} />
            <Tooltip title="Notifications" arrow>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account" arrow>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", sm: "block" }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: `1px solid ${alpha('#000', 0.06)}` } }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 4 },
          py: 4,
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
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant={isSm ? 'h5' : 'h4'} fontWeight={900} sx={{ color: "#000000", mb: 0.5,
                textShadow: (t) => `0 1px 0 ${alpha(t.palette.common.black, 0.2)}`,
              }}>
                Welcome, {user?.username || 'Admin'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center", maxWidth: 720 }}>
                Here’s an overview of your platform’s statistics and recent activity.
              </Typography>
            </Box>

            {/* Stats grid using CSS grid for maximum compatibility */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 2,
              width: '100%',
              maxWidth: 1100,
            }}>
              <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                <StatCard title="Total Users" value={totalUsers} loading={loadingStats} icon={PeopleIcon} />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                <StatCard title="Total Files Uploaded" value={totalFiles} loading={loadingStats} icon={FolderIcon} />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' } }}>
                <StatCard title="Total Personal Details" value={totalDetails} loading={loadingStats} icon={DescriptionIcon} />
              </Box>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1 }}>
              <Button variant="contained" startIcon={<PeopleIcon />} onClick={handleManageUsers}>
                Manage Users
              </Button>
              <Button variant="contained" color="secondary" startIcon={<FolderIcon />} onClick={handleManageFiles}>
                Manage Files
              </Button>
              <Button variant="outlined" startIcon={<DescriptionIcon />} onClick={handleManagePersonalDetails}>
                Manage Personal Details
              </Button>
            </Stack>
          </>
        )}

        {/* Listing views */}
        {['users', 'files', 'details'].includes(view) && (
          <Box sx={{ width: '100%', maxWidth: 1100 }}>
            {/* Header with search and actions */}
            <Box sx={{
              position: 'sticky',
              top: 72,
              zIndex: 1,
              backdropFilter: 'saturate(180%) blur(8px)',
              backgroundColor: (t) => alpha(t.palette.background.default, 0.8),
              borderRadius: 2,
              p: 1.5,
              mb: 2,
              boxShadow: (t) => `0 6px 16px ${alpha(t.palette.common.black, 0.04)}`,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ mr: 1 }}>
                {view === 'users' ? 'All Users' : view === 'files' ? 'All Files' : 'All Personal Details'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ position: 'relative', minWidth: 240 }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ display: 'grid', placeItems: 'center', px: 1 }}>
                          <SearchIcon fontSize="small" />
                        </Box>
                      ),
                    }}
                    sx={{ width: { xs: '100%', sm: 260 } }}
                  />
                </Box>
                <Tooltip title="Refresh" arrow>
                  <span>
                    <IconButton
                      onClick={() => {
                        if (view === 'users') fetchAllUsers();
                        if (view === 'files') fetchAllFiles();
                        if (view === 'details') fetchAllPersonalDetailsList();
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Button variant="outlined" onClick={() => setView('stats')}>
                  Back to Dashboard
                </Button>
              </Box>
            </Box>

            {/* Table */}
            {(tableConfig.loading) ? (
              <Box sx={{ display: 'grid', gap: 1 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={56} />
                ))}
              </Box>
            ) : tableConfig.rows?.length ? (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: (t) => `0 6px 20px ${alpha(t.palette.common.black, 0.08)}` }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {tableConfig.columns.map((col) => (
                        <TableCell key={col.key} sx={{ fontWeight: 800 }}>{col.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableConfig.rows.map((row) => (
                      <TableRow key={row._id} hover sx={{ cursor: 'default' }}>
                        {tableConfig.columns.map((col) => (
                          <TableCell key={col.key}>
                            {col.render ? col.render(row[col.key]) : (row[col.key] ?? '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState title="No results" subtitle="Try another query or refresh the list." />
            )}
          </Box>
        )}
      </Box>

      {/* Snackbars */}
      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={1500}
        onClose={() => setLogoutSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setLogoutSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          Logged out successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
