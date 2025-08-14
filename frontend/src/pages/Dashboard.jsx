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
  Stack,
  useMediaQuery,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import LanguageIcon from "@mui/icons-material/Language";
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
import Profile from "../pages/Profile";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const drawerWidth = 240;

const Dashboard = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dateTime, setDateTime] = useState(new Date());

  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname === "/profile" || location.pathname === "/cards"
  );

  const [openProfile, setOpenProfile] = useState(false);
  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  // Use system preference for dark mode on first load
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    if (localStorage.getItem("darkMode") === null) {
      setDarkMode(systemPrefersDark);
    }
  }, [systemPrefersDark]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      ...(darkMode && {
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
      }),
    },
    typography: {
      fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
      h4: { fontWeight: 600 },
      body1: { fontSize: "1rem" },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? "#121212" : "#fff",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: darkMode
                ? "0 8px 16px rgba(255 255 255 / 0.15)"
                : "0 8px 16px rgba(0,0,0,0.25)",
            },
          },
        },
      },
    },
  });

  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
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

  const cardUrlMap = {
    philhealth: "https://www.philhealth.gov.ph/",
    sss: "https://www.sss.gov.ph/",
    tin: "https://www.bir.gov.ph/",
    pagibig: "https://www.pagibigfund.gov.ph/",
    "pag-ibig": "https://www.pagibigfund.gov.ph/",
    umid: "https://www.umnid.gov.ph/", // update if needed
    driver: "https://www.lto.gov.ph/",
    national: "https://national-id.gov.ph",
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
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
      setLogoutSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 1500);
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

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: darkMode ? "#121212" : "white",
      }}
    >
      <Box>
        <Box textAlign="center" p={2} sx={{ pt: { xs: 8, sm: 10 } }}>
          <IconButton onClick={handleOpenProfile} sx={{ p: 0 }}>
            <Avatar
              src={user?.profilePic || ""}
              alt={user?.username}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 1,
                bgcolor: "primary.main",
                fontSize: 32,
                cursor: "pointer",
              }}
            >
              {!user?.profilePic && (user?.username?.[0]?.toUpperCase() || "U")}
            </Avatar>
          </IconButton>

          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user?.username || "User"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordWrap: "break-word" }}
            noWrap
          >
            {user?.email || "N/A"}
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" selected={location.pathname === "/"}>
              <ListItemIcon sx={{ color: "primary.main" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleSettingsClick}>
              <ListItemIcon sx={{ color: "warning.main" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {settingsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItemButton onClick={handleOpenProfile}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/cards"
                selected={location.pathname === "/cards"}
              >
                <ListItemIcon>
                  <CreditCardIcon sx={{ color: "secondary.main" }} />
                </ListItemIcon>
                <ListItemText primary="Manage Cards" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/personal-details"
              selected={location.pathname === "/personal-details"}
            >
              <ListItemIcon sx={{ color: "info.main" }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Personal Details" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/user-file"
              selected={location.pathname === "/user-file"}
            >
              <ListItemIcon sx={{ color: "secondary.main" }}>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="File" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box>
        <Divider sx={{ my: 1 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: "grey.600" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            background: "linear-gradient(to right, #1e3c72, #2a5298)",
            color: "#fff",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2, display: { sm: "none" } }}
                aria-label="open drawer"
              >
                <MenuIcon />
              </IconButton>

              {/* Logo and App Name */}
              <Box
                component="img"
                src="/favicon.ico"
                alt="Vaultify Logo"
                sx={{ width: 32, height: 32, mr: 1, userSelect: "none" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", userSelect: "none" }}
                noWrap
              >
                Vaultify
              </Typography>
            </Box>

            {/* Welcome & Tip container with overflow hidden and responsive */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                position: "relative",
                height: { xs: 36, sm: 48 },
                mx: 2,
                minWidth: 0,
                display: { xs: "none", sm: "block" }, // hide on xs for space
              }}
              aria-label="Welcome messages"
            >
              {/* First Message */}
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  position: "absolute",
                  top: 0,
                  whiteSpace: "nowrap",
                  animation: "scrollText1 12s linear infinite",
                  userSelect: "none",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Welcome, {user?.username || "Nikko"}
              </Typography>

              {/* Second Message */}
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  position: "absolute",
                  top: "1.8rem",
                  whiteSpace: "nowrap",
                  animation: "scrollText2 15s linear infinite",
                  userSelect: "none",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Vaultify Tip: Your data is encrypted end-to-end.
              </Typography>

              <style>
                {`
                  @keyframes scrollText1 {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                  }
                  @keyframes scrollText2 {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                  }
                `}
              </style>
            </Box>

            <Typography
              variant="body2"
              sx={{
                mr: 2,
                whiteSpace: "nowrap",
                userSelect: "none",
                color: "rgba(255,255,255,0.8)",
              }}
              aria-label="Current date and time"
            >
              {dateTime.toLocaleString()}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                arrow
              >
                <IconButton
                  color="inherit"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  size="large"
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {/* Show logout icon on small screens */}
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                <Tooltip title="Logout" arrow>
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    aria-label="Logout"
                    size="large"
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="Navigation drawer"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth, top: "64px", height: "calc(100% - 64px)" },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 4, md: 6 },
            pt: { xs: 10, sm: 12 },
            pb: 12,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box mb={4} width="100%">
            <Typography
  variant="h5"
  gutterBottom
  fontWeight={700}
  letterSpacing={0.5}
  align="center" // centers text horizontally
  sx={{ display: "block", textAlign: "center" }} // ensures centering across layouts
>
  Government ID Cards
</Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : idCards.length === 0 ? (
              <Typography variant="body2" sx={{ ml: 2 }}>
                No ID cards saved yet.
              </Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {idCards.map((card) => {
                  const key = Object.keys(logoMap).find((k) =>
                    card.cardName.toLowerCase().includes(k)
                  );
                  const logo = logoMap[key];

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={card._id}>
                      <Box
                        component="a"
                        href={cardUrlMap[key] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: "none",
                          display: "block",
                          height: "100%",
                        }}
                        tabIndex={-1}
                      >
                        <Card
                          sx={{
                            backgroundColor: getCardColor(card.cardName),
                            color: darkMode ? "#000" : "#333",
                            borderRadius: 3,
                            boxShadow: 4,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                            "&:hover": {
                              boxShadow: 8,
                              transform: "scale(1.03)",
                              transition: "all 0.3s ease-in-out",
                            },
                          }}
                          aria-label={`${card.cardName} government ID card`}
                          role="link"
                        >
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            {logo && (
                              <Box
                                component="img"
                                src={logo}
                                alt={`${card.cardName} logo`}
                                sx={{ width: 36, height: 36, userSelect: "none" }}
                              />
                            )}
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{
                                textTransform: "uppercase",
                                fontFamily: "'Poppins', sans-serif",
                                color: darkMode ? "#222" : "#111",
                                userSelect: "none",
                              }}
                            >
                              {card.cardName}
                            </Typography>
                          </Box>
                          <Typography variant="body2" mb={0.5}>
                            <strong>Card Number:</strong> {card.cardNumber}
                          </Typography>
                          <Typography variant="body2" mb={0.5}>
                            <strong>Name:</strong> {card.fullName}
                          </Typography>
                          <Typography variant="body2" mb={0.5}>
                            <strong>Birthdate:</strong> {card.birthdate}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Address:</strong> {card.address}
                          </Typography>
                        </Card>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Render children components */}
          {children}

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              position: "fixed",
              bottom: 0,
              left: { sm: `${drawerWidth}px` },
              width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
              bgcolor: "background.paper",
              boxShadow: 3,
              py: 1,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 1, flexWrap: "wrap" }}
            >
              <IconButton component="a" href="/about" color="inherit" aria-label="About">
                <InfoIcon />
              </IconButton>

              <IconButton
                component="a"
                href="mailto:nickforjobacc@gmail.com?subject=Message%20from%20Personal%20Record%20Keeper"
                color="inherit"
                aria-label="Email"
              >
                <EmailIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://nikkoboy123.github.io/nik/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Portfolio"
              >
                <LanguageIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://github.com/nikgitofficial"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                mt: 4,
                pb: 2,
                fontWeight: 300,
              }}
            >
              &copy; {new Date().getFullYear()} Vaultify . All rights reserved. Built by{" "}
              <strong style={{ color: "#1976d2" }}>Nikko MP</strong>.
            </Typography>
          </Box>
        </Box>

        {/* Profile Dialog */}
        <Dialog
          open={openProfile}
          onClose={handleCloseProfile}
          fullWidth
          maxWidth="sm"
          scroll="paper"
          aria-labelledby="profile-dialog-title"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="profile-dialog-title">
            Profile
            <IconButton
              aria-label="close"
              onClick={handleCloseProfile}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Profile />
          </DialogContent>
        </Dialog>

        {/* Logout Snackbar */}
        <Snackbar
          open={logoutSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setLogoutSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setLogoutSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have been logged out successfully.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
