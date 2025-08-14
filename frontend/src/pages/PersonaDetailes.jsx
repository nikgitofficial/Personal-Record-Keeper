import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import {
  Typography,
  TextField,
  Button,
  Grid,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";

const PersonalDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [deleting, setDeleting] = useState(false);

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
      setFormModalOpen(false);
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
    setFormModalOpen(true);
  };

  const handleDelete = (id) => {
    setDetailToDelete(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!detailToDelete) return;

    setDeleting(true);

    try {
      await axios.delete(`/personal-details/${detailToDelete}`);
      setSnackbar({ open: true, message: "Personal detail deleted", severity: "info" });
      fetchDetails();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete personal detail", severity: "error" });
    } finally {
      setDeleting(false);
      setConfirmDialogOpen(false);
      setDetailToDelete(null);
    }
  };

  const openAddModal = () => {
    setForm({ fullName: "", birthdate: "", address: "", phoneNumber: "", email: "" });
    setIsEditing(false);
    setEditId(null);
    setFormModalOpen(true);
  };

  const filteredDetails = details.filter((d) =>
    d.fullName.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center" // aligns everything to the right
      maxWidth="100%"
    >
      {/* Search & Add Button */}
      <Box
        mb={2}
        display="flex"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap={2}
        width={isMobile ? "100%" : 650} // fixed width for alignment
      >
        <TextField
          label="Search by Full Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          size="small"
          sx={{ minWidth: 240, flexGrow: 1 }}
        />
        <Button variant="contained" onClick={openAddModal} sx={{ whiteSpace: "nowrap" }}>
          Add Personal Detail
        </Button>
      </Box>

      {/* Title */}
      <Typography variant="h6" fontWeight={600} gutterBottom align="right" sx={{ width: isMobile ? "100%" : 650 }}>
        Saved Personal Details
      </Typography>

      {/* Table or Loading */}
      {loading ? (
        <Box display="flex" justifyContent="flex-end" my={4} width={isMobile ? "100%" : 650}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: isMobile ? 240 : 300,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            width: isMobile ? "100%" : 650,
          }}
        >
          <Table stickyHeader aria-label="personal details table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Birthdate</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No personal details found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDetails.map((detail) => (
                  <TableRow key={detail._id} tabIndex={-1}>
                    <TableCell>{detail.fullName}</TableCell>
                    <TableCell>{detail.birthdate}</TableCell>
                    <TableCell>{detail.address}</TableCell>
                    <TableCell>{detail.phoneNumber || "-"}</TableCell>
                    <TableCell>{detail.email || "-"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(detail)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(detail._id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={() => setFormModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Personal Detail" : "Add Personal Detail"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth required />
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
              <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth multiline rows={2} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormModalOpen(false)} disabled={buttonDisabled}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={buttonDisabled}>
            {buttonDisabled ? <CircularProgress size={20} color="inherit" /> : (isEditing ? "Update Detail" : "Add Detail")}
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button color="error" onClick={confirmDelete} disabled={deleting} variant="contained">
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
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
