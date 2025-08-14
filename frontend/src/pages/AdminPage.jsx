import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome, Admin! You can manage users, view stats, and more.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/admin-dashboard")}>
        Go to User Dashboard
      </Button>
    </Container>
  );
};

export default AdminPage;
