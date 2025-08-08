// frontend/src/pages/PersonalDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // your configured axios instance
import {
  Box, Button, TextField, Typography,
  List, ListItem, ListItemText, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
  CircularProgress, Snackbar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const PersonalDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ fullName: "", birthdate: "", address: "" });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/personal-details");
      setDetails(res.data);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load personal details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  const handleOpenDialog = (detail = null) => {
    if (detail) {
      setForm({
        fullName: detail.fullName,
        birthdate: detail.birthdate.slice(0, 10),
        address: detail.address,
      });
      setEditId(detail._id);
    } else {
      setForm({ fullName: "", birthdate: "", address: "" });
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ fullName: "", birthdate: "", address: "" });
    setEditId(null);
  };

  const handleSubmit = async () => {
    const { fullName, birthdate, address } = form;
    if (!fullName || !birthdate || !address) {
      showSnackbar("Please fill all fields", "warning");
      return;
    }
    try {
      if (editId) {
        await axios.put(`/personal-details/${editId}`, form);
        showSnackbar("Personal detail updated successfully");
      } else {
        await axios.post("/personal-details", form);
        showSnackbar("Personal detail added successfully");
      }
      fetchDetails();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to save personal detail", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this personal detail?")) return;
    try {
      await axios.delete(`/personal-details/${id}`);
      showSnackbar("Personal detail deleted");
      fetchDetails();
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete personal detail", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Typography variant="h4" mb={2}>Personal Details</Typography>

      <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add Personal Detail
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : details.length === 0 ? (
        <Typography>No personal details found.</Typography>
      ) : (
        <List>
          {details.map((detail) => (
            <ListItem key={detail._id} secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleOpenDialog(detail)}><Edit /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(detail._id)}><Delete /></IconButton>
              </>
            }>
              <ListItemText
                primary={detail.fullName}
                secondary={
                  <>
                    <div>Birthdate: {new Date(detail.birthdate).toLocaleDateString()}</div>
                    <div>Address: {detail.address}</div>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editId ? "Edit Personal Detail" : "Add Personal Detail"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Birthdate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.birthdate}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            multiline
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={4000}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default PersonalDetails;
