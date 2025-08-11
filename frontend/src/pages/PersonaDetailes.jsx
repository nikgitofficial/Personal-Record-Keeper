import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const PersonalDetails = () => {
  const { currentUser } = useContext(AuthContext);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    birthdate: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/personal-details");
      setDetails(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to fetch personal details", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { fullName, birthdate, address } = form;
    if (!fullName || !birthdate || !address) {
      setSnackbar({ open: true, message: "Full Name, Birthdate and Address are required.", severity: "warning" });
      return;
    }

    setButtonDisabled(true);

    try {
      if (isEditing && editId) {
        await axios.put(`/personal-details/${editId}`, form);
        setSnackbar({ open: true, message: "Personal detail updated!", severity: "success" });
      } else {
        await axios.post("/personal-details", form);
        setSnackbar({ open: true, message: "Personal detail added!", severity: "success" });
      }
      setForm({ fullName: "", birthdate: "", address: "", phoneNumber: "", email: "" });
      setIsEditing(false);
      setEditId(null);
      fetchDetails();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to save personal detail", severity: "error" });
    } finally {
      setButtonDisabled(false);
    }
  };

  const handleEdit = (detail) => {
    setForm({
      fullName: detail.fullName,
      birthdate: detail.birthdate,
      address: detail.address,
      phoneNumber: detail.phoneNumber || "",
      email: detail.email || "",
    });
    setIsEditing(true);
    setEditId(detail._id);
  };

  const handleDelete = async (id) => {
    setDetailToDelete(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!detailToDelete) return;

    try {
      await axios.delete(`/personal-details/${detailToDelete}`);
      setSnackbar({ open: true, message: "Personal detail deleted", severity: "info" });
      fetchDetails();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete personal detail", severity: "error" });
    } finally {
      setConfirmDialogOpen(false);
      setDetailToDelete(null);
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {isEditing ? "Edit Personal Detail" : "Add Personal Detail"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={buttonDisabled}
              fullWidth
            >
              {isEditing ? "Update Detail" : "Add Detail"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Saved Personal Details
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {details.map((detail) => (
            <Grid item xs={12} sm={6} md={4} key={detail._id}>
              <Card
                sx={{
                  borderLeft: "5px solid #4caf50",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardHeader
                  title={detail.fullName}
                  subheader={`Birthdate: ${detail.birthdate}`}
                  action={
                    <>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(detail)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(detail._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Address: {detail.address}
                  </Typography>
                  {detail.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      Phone: {detail.phoneNumber}
                    </Typography>
                  )}
                  {detail.email && (
                    <Typography variant="body2" color="text.secondary">
                      Email: {detail.email}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this personal detail? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalDetails;
