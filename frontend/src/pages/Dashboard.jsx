import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Avatar,
  useTheme,
  createTheme,
  ThemeProvider,
  Divider,
  ListItemButton,
  Card,
  Grid,
  Collapse,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Insights as InsightsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { InsertDriveFile as InsertDriveFileIcon } from "@mui/icons-material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

import philhealthLogo from "../assets/logos/philhealth1.png";
import sssLogo from "../assets/logos/sss.png";
import tinLogo from "../assets/logos/tin1.png";
import pagibigLogo from "../assets/logos/pagibig.png";
import umidLogo from "../assets/logos/umid.png";
import driverLogo from "../assets/logos/drivers2rb.png";
import nationalLogo from "../assets/logos/nationalid.png";

const drawerWidth = 240;

const Dashboard = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname === "/profile" || location.pathname === "/settings"
  );

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
      h4: { fontWeight: 600 },
      body1: { fontSize: "1rem" },
    },
  });

  const getCardColor = (name) => {
    const card = name.toLowerCase();
    if (card.includes("philhealth")) return darkMode ? "#b2a429" : "#fff9c4";
    if (card.includes("sss")) return darkMode ? "#1976d2" : "#1e88e5";
    if (card.includes("tin")) return darkMode ? "#ffa000" : "#ffe082";
    if (card.includes("pagibig")) return darkMode ? "#1565c0" : "#0d47a1";
    if (card.includes("umid")) return darkMode ? "#4dd0e1" : "#b2ebf2";
    if (card.includes("driver")) return darkMode ? "#aed581" : "#dcedc8";
    if (card.includes("national")) return darkMode ? "#9e9e9e" : "#e0e0e0";
    return darkMode ? "#616161" : "#E0E0E0";
  };

  const fetchIdCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/id-cards", { withCredentials: true });
      setIdCards(res.data);
    } catch (err) {
      console.error("Failed to fetch ID cards", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdCards();
    const handleCardChange = () => fetchIdCards();

    window.addEventListener("card-added", handleCardChange);
    window.addEventListener("card-deleted", handleCardChange);
    window.addEventListener("card-updated", handleCardChange);

    return () => {
      window.removeEventListener("card-added", handleCardChange);
      window.removeEventListener("card-deleted", handleCardChange);
      window.removeEventListener("card-updated", handleCardChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }
  };

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleSettingsClick = () => setSettingsOpen((prev) => !prev);

  const logoMap = {
    philhealth: philhealthLogo,
    sss: sssLogo,
    tin: tinLogo,
    "pag-ibig": pagibigLogo,
    pagibig: pagibigLogo,
    umid: umidLogo,
    driver: driverLogo,
    national: nationalLogo,
  };

  const drawer = (
    <Box>
      <Box textAlign="center" p={2} sx={{ pt: { xs: 8, sm: 10 } }}>
        <Avatar
          src={user?.profilePic || ""}
          alt={user?.username}
          sx={{ width: 80, height: 80, mx: "auto", mb: 1, bgcolor: "primary.main", fontSize: 32 }}
        >
          {!user?.profilePic && (user?.username?.[0]?.toUpperCase() || "U")}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">{user?.username || "User"}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.email || "N/A"}</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" selected={location.pathname === "/"}>
            <ListItemIcon sx={{ color: 'primary.main' }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleSettingsClick}>
            <ListItemIcon sx={{ color: 'warning.main' }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/profile" selected={location.pathname === "/profile"}>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
           <ListItemButton component={Link} to="/settings" selected={location.pathname === "/settings"}>
  <ListItemIcon><CreditCardIcon sx={{ color: 'secondary.main' }} /></ListItemIcon>
  <ListItemText primary="Manage Cards" />
</ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/analytics" selected={location.pathname === "/analytics"}>
            <ListItemIcon sx={{ color: 'success.main' }}><InsightsIcon /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/personal-details" selected={location.pathname === "/personal-details"}>
            <ListItemIcon sx={{ color: 'info.main' }}><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Personal Details" />
          </ListItemButton>
        </ListItem>
<ListItem disablePadding >
  <ListItemButton component={Link} to="/user-file" selected={location.pathname === "/user-file"}>
    <ListItemIcon sx={{ color: 'secondary.main' }} ><InsertDriveFileIcon /></ListItemIcon>
    <ListItemText primary="File" />
  </ListItemButton>
</ListItem>

        <Divider sx={{ my: 1 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'grey.600' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Welcome, {user?.username || "User"}
            </Typography>
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 8, sm: 10 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4">{user?.username || "User"}</Typography>
            <Typography variant="body1" color="text.secondary">Email: {user?.email || "N/A"}</Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Government ID Cards</Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : idCards.length === 0 ? (
              <Typography variant="body2" sx={{ ml: 2 }}>
                No ID cards saved yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {idCards.map((card) => {
                  const key = Object.keys(logoMap).find((k) =>
                    card.cardName.toLowerCase().includes(k)
                  );
                  const logo = logoMap[key];

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={card._id}>
                      <Card
                        sx={{
                          backgroundColor: getCardColor(card.cardName),
                          color: "#fff",
                          borderRadius: 3,
                          boxShadow: 4,
                          width: "100%",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: 2,
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {logo && (
                            <Box component="img" src={logo} alt={card.cardName} sx={{ width: 36, height: 36 }} />
                          )}
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "'Poppins', sans-serif",
                              color: "#333",
                            }}
                          >
                            {card.cardName}
                          </Typography>
                        </Box>
                        <Typography variant="body1"><strong>Card Number:</strong> {card.cardNumber}</Typography>
                        <Typography variant="body1"><strong>Name:</strong> {card.fullName}</Typography>
                        <Typography variant="body1"><strong>Birthdate:</strong> {card.birthdate}</Typography>
                        <Typography variant="body1"><strong>Address:</strong> {card.address}</Typography>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>

          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
