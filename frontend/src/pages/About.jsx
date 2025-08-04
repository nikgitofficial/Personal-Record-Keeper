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
  useTheme,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StorageIcon from "@mui/icons-material/Storage";

const About = () => {
  const theme = useTheme();

  const sections = [
    {
      title: "Government ID & Bank Cards",
      description:
        "Securely store details of your SSS, PhilHealth, TIN, Pag-IBIG, UMID, Driver’s License, National ID, and even personal cards like bank accounts—all in one customizable dashboard.",
      icon: <AssignmentIndIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: "Personal Details",
      description:
        "Save your full name, birthday, address, and other essential identity information. Easily update and manage these records anytime.",
      icon: <AccountCircleIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: "Profile Picture",
      description:
        "Upload your profile image to personalize your experience and identify your record easily throughout the app.",
      icon: <AccountCircleIcon />,
      color: theme.palette.info.main,
    },
    {
      title: "File Uploader",
      description:
        "Upload, rename, search, and manage files like PDFs, documents, and images. Your records are safely stored and easy to access.",
      icon: <FolderIcon />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        About Personal Record Keeper
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 5 }}
      >
        The Personal Record Keeper App is your secure and centralized solution
        for managing important records like government IDs, bank cards,
        personal details, and essential files. Whether you're organizing your
        identity, managing uploads, or personalizing your digital presence,
        this app brings everything together with ease and clarity.
      </Typography>

      <Divider sx={{ mb: 5 }} />

      <Grid container spacing={4}>
        {sections.map((section, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: section.color,
                      width: 64,
                      height: 64,
                    }}
                  >
                    {section.icon}
                  </Avatar>
                </Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  textAlign="center"
                  fontWeight="bold"
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Personal Record Keeper. All rights
          reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
