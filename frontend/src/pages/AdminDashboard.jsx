import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Grid,
  Paper, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Snackbar, CssBaseline,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Tooltip
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axios";

const drawerWidth = 240;

export default function AdminDashboard() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("stats");
  const [darkMode, setDarkMode] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);

  // Tables
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [details, setDetails] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
    document.body.classList.toggle("dark-mode");
  };

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await api.get("/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch table data
  const fetchTableData = async (type) => {
    setLoadingTable(true);
    try {
      if (type === "users") {
        const res = await api.get("/admin/all-users", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
        setUsers(res.data);
      }
      if (type === "files") {
        const res = await api.get("/admin/all-files", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
        setFiles(res.data);
      }
      if (type === "details") {
        const res = await api.get("/admin/all-personal-details", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
        setDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTable(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>Admin Panel</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => setView("stats")}>
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => { setView("users"); fetchTableData("users"); }}>
          <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button onClick={() => { setView("files"); fetchTableData("files"); }}>
          <ListItemIcon><FolderIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Files" />
        </ListItem>
        <ListItem button onClick={() => { setView("details"); fetchTableData("details"); }}>
          <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Personal Details" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", backgroundColor: darkMode ? "#121212" : theme.palette.grey[50] }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={handleDrawerToggle}><MenuIcon /></IconButton>
            <Typography variant="h6" fontWeight="bold">Admin Dashboard</Typography>
          </Box>
          <Box>
            <Tooltip title="Toggle Theme"><IconButton onClick={toggleTheme}>{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton></Tooltip>
            <Tooltip title="Logout"><IconButton onClick={() => { localStorage.removeItem("accessToken"); window.location.reload(); }}><LogoutIcon /></IconButton></Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }} open>{drawer}</Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}>{drawer}</Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {view === "stats" && (
          <Grid container spacing={3} justifyContent="center">
            {["Total Users", "Total Files", "Total Personal Details"].map((title, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="h4">
                    {loadingStats ? <CircularProgress size={28} /> : stats[Object.keys(stats)[idx]]}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {(view === "users" || view === "files" || view === "details") && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {view === "users" && ["Username", "Email", "Role", "Created At"].map(h => <TableCell key={h}>{h}</TableCell>)}
                  {view === "files" && ["Filename", "Uploaded By", "URL", "Created At"].map(h => <TableCell key={h}>{h}</TableCell>)}
                  {view === "details" && ["Full Name", "Birthdate", "Address", "Email", "Phone", "User"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingTable ? (
                  <TableRow><TableCell colSpan={10} align="center"><CircularProgress /></TableCell></TableRow>
                ) : (
                  (view === "users" ? users : view === "files" ? files : details).map((row) => (
                    <TableRow key={row._id}>
                      {view === "users" && <><TableCell>{row.username}</TableCell><TableCell>{row.email}</TableCell><TableCell>{row.role}</TableCell><TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell></>}
                      {view === "files" && <><TableCell>{row.filename}</TableCell><TableCell>{row.uploadedBy}</TableCell><TableCell><a href={row.url} target="_blank" rel="noreferrer">Link</a></TableCell><TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell></>}
                      {view === "details" && <><TableCell>{row.fullName}</TableCell><TableCell>{new Date(row.birthdate).toLocaleDateString()}</TableCell><TableCell>{row.address}</TableCell><TableCell>{row.email}</TableCell><TableCell>{row.phoneNumber}</TableCell><TableCell>{row.user}</TableCell></>}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
