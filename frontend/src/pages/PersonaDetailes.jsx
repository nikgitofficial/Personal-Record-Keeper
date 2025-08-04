import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Snackbar, Dialog, DialogActions,
  DialogContent, DialogTitle, Tooltip, TextField, Grid, Alert
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "../api/axios";

const PersonalDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ fullName: "", birthdate: "", address: "" });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/details");
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName || form.fullName.length < 2) newErrors.fullName = "Full name is required.";
    if (!form.birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(form.birthdate)) newErrors.birthdate = "Valid birthdate required.";
    if (!form.address || form.address.length < 3) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`/api/details/${editId}`, form);
        setSnackbar({ open: true, message: "Personal detail updated", severity: "success" });
      } else {
        await axios.post("/api/details", form);
        setSnackbar({ open: true, message: "Personal detail added", severity: "success" });
      }
      fetchDetails();
      setOpenDialog(false);
      setForm({ fullName: "", birthdate: "", address: "" });
      setEditId(null);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error saving data", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/details/${id}`);
      setSnackbar({ open: true, message: "Deleted successfully", severity: "info" });
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (detail) => {
    setForm({
      fullName: detail.fullName,
      birthdate: detail.birthdate,
      address: detail.address
    });
    setEditId(detail._id);
    setOpenDialog(true);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Personal Details</Typography>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>Add New</Button>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Birthdate</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((d) => (
                <TableRow key={d._id}>
                  <TableCell>{d.fullName}</TableCell>
                  <TableCell>{d.birthdate}</TableCell>
                  <TableCell>{d.age}</TableCell>
                  <TableCell>{d.address}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(d)}><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(d._id)}><DeleteIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editId ? "Edit" : "Add"} Personal Detail</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Birthdate"
                name="birthdate"
                type="date"
                value={form.birthdate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthdate}
                helperText={errors.birthdate}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editId ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PersonalDetails;
