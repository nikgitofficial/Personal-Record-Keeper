import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  useTheme
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StorageIcon from "@mui/icons-material/Storage";

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        About Personal Record Keeper
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The Personal Record Keeper App is your secure and centralized solution for managing
        important records like government IDs, bank cards, personal details, and essential files.
        Whether you're organizing your identity, managing uploads, or personalizing your digital
        presence, this app brings everything together with ease and clarity.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={4}>
        {/* Personal Cards */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mb: 2 }}>
                <AssignmentIndIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Government ID & Bank Cards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Securely store details of your SSS, PhilHealth, TIN, Pag-IBIG, UMID, Driver’s
                License, National ID, and even personal cards like bank accounts—all in one
                customizable dashboard.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Details */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, mb: 2 }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Save your full name, birthday, address, and other essential identity information.
                Easily update and manage these records anytime.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Picture */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.info.main, mb: 2 }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your profile image to personalize your experience and identify your record
                easily throughout the app.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* File Upload */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mb: 2 }}>
                <FolderIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                File Uploader
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload, rename, search, and manage files like PDFs, documents, and images. Your
                records are safely stored and easy to access.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Personal Record Keeper. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
