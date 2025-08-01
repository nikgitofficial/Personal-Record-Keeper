import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TablePagination,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import axios from "../api/axios";

const PersonalDetails = () => {
  const [details, setDetails] = useState([]);
  const [form, setForm] = useState({ fullName: "", birthdate: "", address: "" });
  const [editId, setEditId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const fetchDetails = async () => {
    const res = await axios.get("/personal-details");
    setDetails(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName || form.fullName.length < 2) newErrors.fullName = "Full name is required.";
    if (!form.birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(form.birthdate)) newErrors.birthdate = "Valid birthdate required.";
    if (!form.address || form.address.length < 3) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDialogOpen = () => {
    setForm({ fullName: "", birthdate: "", address: "" });
    setEditId(null);
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (detail) => {
    setForm({ fullName: detail.fullName, birthdate: detail.birthdate, address: detail.address });
    setEditId(detail._id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    await axios.delete(`/personal-details/${id}`);
    setOpenSnackbar({ open: true, message: "Deleted successfully", severity: "info" });
    setLoadingDelete(false);
    fetchDetails();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoadingSave(true);

    try {
      if (editId) {
        await axios.put(`/personal-details/${editId}`, form);
        setOpenSnackbar({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await axios.post("/personal-details", form);
        setOpenSnackbar({ open: true, message: "Added successfully", severity: "success" });
      }
      fetchDetails();
      setForm({ fullName: "", birthdate: "", address: "" });
      setOpenDialog(false);
      setEditId(null);
    } catch (err) {
      setOpenSnackbar({ open: true, message: "Something went wrong", severity: "error" });
    }

    setLoadingSave(false);
  };

  const groupedDetails = details.reduce((acc, item) => {
    const year = new Date(item.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Personal Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={handleDialogOpen}>
          Add New Detail
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow  colSpan={4}
    sx={{
      backgroundColor: isDark ? "#2a2a2a" : "#f4f6f8",
      color: isDark ? "#fff" : "#000",
      fontWeight: "bold",
    }}>
              <TableCell>Full Name</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedDetails).map(([year, items]) => (
              <React.Fragment key={year}>
                
                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((detail) => (
                  <TableRow key={detail._id}>
                    <TableCell>{detail.fullName}</TableCell>
                    <TableCell>{detail.birthdate}</TableCell>
                    <TableCell>{detail.address}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(detail)}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => setConfirmDeleteId(detail._id)}><Delete color="error" /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={details.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Detail" : "Add New Detail"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
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
                  InputLabelProps={{ shrink: true }}
                  fullWidth
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
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loadingSave}
              startIcon={loadingSave ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {editId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this detail?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDelete(confirmDeleteId);
              setConfirmDeleteId(null);
            }}
            color="error"
            variant="contained"
            startIcon={loadingDelete ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={openSnackbar.severity} sx={{ width: "100%" }}>
          {openSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalDetails;
