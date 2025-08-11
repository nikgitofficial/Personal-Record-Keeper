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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { currentUser } = useContext(AuthContext);
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    fullname: "",
    birthdate: "",
    address: "",
    customName: "",
  });
  const [showCustomNameInput, setShowCustomNameInput] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/id-cards");
      setCards(Array.isArray(res.data) ? res.data : res.data.cards || []);
    } catch (err) {
      console.error("Failed to fetch cards", err);
      setCards([]);
      setSnackbar({ open: true, message: "Failed to fetch cards", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setShowCustomNameInput(value === "Others");
    }
  };

  const handleOpenModalForAdd = () => {
    setCardForm({
      name: "",
      customName: "",
      number: "",
      fullname: "",
      birthdate: "",
      address: "",
    });
    setShowCustomNameInput(false);
    setIsEditing(false);
    setEditCardId(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (card) => {
    setCardForm({
      name: card.cardName === "Others" ? "Others" : card.cardName,
      customName: card.cardName === "Others" ? card.cardName : "",
      number: card.cardNumber,
      fullname: card.fullName,
      birthdate: card.birthdate,
      address: card.address,
    });
    setShowCustomNameInput(card.cardName === "Others");
    setIsEditing(true);
    setEditCardId(card._id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setButtonDisabled(false);
  };

  const handleSaveCard = async () => {
    const { name, customName, number, fullname, birthdate, address } = cardForm;
    const finalCardName = name === "Others" ? customName.trim() : name;

    if (!finalCardName || !number || !fullname || !birthdate || !address) {
      setSnackbar({ open: true, message: "Please fill in all fields.", severity: "warning" });
      return;
    }

    setButtonDisabled(true);

    try {
      if (isEditing && editCardId) {
        await axios.put(`/id-cards/${editCardId}`, {
          cardName: finalCardName,
          cardNumber: number,
          fullName: fullname,
          birthdate,
          address,
        });
        setSnackbar({ open: true, message: "Card updated successfully!", severity: "success" });
      } else {
        await axios.post("/id-cards/add", {
          cardName: finalCardName,
          cardNumber: number,
          fullName: fullname,
          birthdate,
          address,
        });
        setSnackbar({ open: true, message: "Card added successfully!", severity: "success" });
      }

      fetchCards();
      window.dispatchEvent(new Event("card-updated"));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save card", err);
      setSnackbar({ open: true, message: "Failed to save card", severity: "error" });
      setButtonDisabled(false);
    }
  };

  const handleDeleteCard = async (id) => {
    setDeletingCardId(id);
    try {
      await axios.delete(`/id-cards/${id}`);
      fetchCards();
      setSnackbar({ open: true, message: "Card deleted successfully!", severity: "info" });
      window.dispatchEvent(new Event("card-deleted"));
    } catch (err) {
      console.error("Failed to delete card", err);
      setSnackbar({ open: true, message: "Failed to delete card", severity: "error" });
    } finally {
      setDeletingCardId(null);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <Box p={2} maxWidth="md" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Government ID Cards
        </Typography>
        <Button variant="contained" onClick={handleOpenModalForAdd}>
          Add New ID Card
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : cards.length === 0 ? (
        <Typography>No saved cards yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <Card
                sx={{
                  borderLeft: "5px solid #1976d2",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <CardHeader
                  title={card.cardName}
                  action={
                    <>
                      <Tooltip title="Edit Card">
                        <IconButton onClick={() => handleOpenModalForEdit(card)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Card">
                        <span>
                          <IconButton
                            onClick={() => {
                              setCardToDelete(card._id);
                              setConfirmDialogOpen(true);
                            }}
                            color="error"
                            disabled={deletingCardId === card._id}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Card Number: <strong>{card.cardNumber}</strong>
                  </Typography>
                  <Typography variant="body2">Name: {card.fullName}</Typography>
                  <Typography variant="body2">Birthdate: {card.birthdate}</Typography>
                  <Typography variant="body2">Address: {card.address}</Typography>
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
            Are you sure you want to delete this ID card? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDeleteCard(cardToDelete)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        scroll="paper"
      >
        <DialogTitle>{isEditing ? "Edit ID Card" : "Add New ID Card"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="modal-card-name-label">ID Type</InputLabel>
                <Select
                  labelId="modal-card-name-label"
                  name="name"
                  value={cardForm.name}
                  label="ID Type"
                  onChange={handleChange}
                  autoFocus={!isEditing}
                >
                  <MenuItem value="PhilHealth">PhilHealth</MenuItem>
                  <MenuItem value="SSS">SSS</MenuItem>
                  <MenuItem value="TIN">TIN</MenuItem>
                  <MenuItem value="Pag-IBIG">Pag-IBIG</MenuItem>
                  <MenuItem value="UMID">UMID</MenuItem>
                  <MenuItem value="Driver's License">Driver's License</MenuItem>
                  <MenuItem value="National ID">National ID</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {showCustomNameInput && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom ID Name"
                  name="customName"
                  value={cardForm.customName}
                  onChange={handleChange}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={showCustomNameInput ? 12 : 6}>
              <TextField
                fullWidth
                label="ID Number"
                name="number"
                value={cardForm.number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullname"
                value={cardForm.fullname}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birthdate"
                name="birthdate"
                type="date"
                value={cardForm.birthdate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={cardForm.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCard}
            disabled={buttonDisabled}
            sx={{ minWidth: 120 }}
          >
            {isEditing ? "Save Changes" : "Add Card"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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

export default Settings;
