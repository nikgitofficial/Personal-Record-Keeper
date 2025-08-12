import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import {
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";

const Cards = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.only("xs"));

  const isDarkMode = theme.palette.mode === "dark";

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

  // Filter state
  const [filterText, setFilterText] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editCardId, setEditCardId] = useState(null);

  // Loading states for buttons
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
      if (value !== "Others") {
        setCardForm((prev) => ({ ...prev, customName: "" }));
      }
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

  // Filter cards based on filterText (case-insensitive)
  const filteredCards = cards.filter((card) => {
    const search = filterText.toLowerCase();
    return (
      card.cardName.toLowerCase().includes(search) ||
      card.cardNumber.toLowerCase().includes(search) ||
      card.fullName.toLowerCase().includes(search) ||
      card.address.toLowerCase().includes(search)
    );
  });

  return (
    <Box
      p={{ xs: 2, sm: 4 }}
      maxWidth="md"
      mx="auto"
      sx={{
        color: isDarkMode ? theme.palette.text.primary : theme.palette.text.primary,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700} flexGrow={1}>
          Government ID Cards
        </Typography>
        <Button variant="contained" size="large" onClick={handleOpenModalForAdd}>
          Add New ID Card
        </Button>
      </Box>

      <TextField
        label="Search by ID Type, Number, Name, or Address"
        variant="outlined"
        fullWidth
        size="medium"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{
          mb: 2,
          bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
          input: {
            color: theme.palette.text.primary,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isDarkMode ? theme.palette.divider : undefined,
            },
            "&:hover fieldset": {
              borderColor: isDarkMode ? theme.palette.primary.light : undefined,
            },
          },
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress size={48} />
        </Box>
      ) : filteredCards.length === 0 ? (
        <Typography variant="body1" textAlign="center" color="text.secondary" mt={6}>
          No matching cards found.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{
            maxHeight: 440,
            overflowY: "auto",
            bgcolor: isDarkMode ? theme.palette.background.paper : "white",
          }}
        >
          <Table stickyHeader aria-label="government id cards table" size="medium">
           <TableHead
  sx={{
    bgcolor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
  }}
>
  <TableRow>
    {["ID Type", "Card Number", "Full Name", "Birthdate", "Address", "Actions"].map(
      (header, index) => (
        <TableCell
          key={header}
          sx={{
            fontWeight: "bold",
            color: isDarkMode ? theme.palette.common.white : theme.palette.common.black,
            minWidth: index === 5 ? 120 : "auto",
          }}
          align={header === "Actions" ? "center" : "left"}
        >
          {header}
        </TableCell>
      )
    )}
  </TableRow>
</TableHead>

            <TableBody>
              {filteredCards.map((card) => (
                <TableRow
                  key={card._id}
                  hover
                  sx={{
                    cursor: "default",
                    bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                  }}
                  tabIndex={-1}
                  role="checkbox"
                >
                  <TableCell sx={{ color: theme.palette.text.primary }}>{card.cardName}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{card.cardNumber}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{card.fullName}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{card.birthdate}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{card.address}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit Card">
                      <IconButton
                        onClick={() => handleOpenModalForEdit(card)}
                        color="primary"
                        size="medium"
                        aria-label={`Edit card ${card.cardName}`}
                      >
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
                          size="medium"
                          disabled={deletingCardId === card._id}
                          aria-label={`Delete card ${card.cardName}`}
                        >
                          {deletingCardId === card._id ? (
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ color: isDarkMode ? "white" : "inherit" }}
                            />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-delete-dialog-title"
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
      >
        <DialogTitle id="confirm-delete-dialog-title" fontWeight={700}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ID card? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" size="large" disabled={deletingCardId !== null}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDeleteCard(cardToDelete)}
            size="large"
            disabled={deletingCardId !== null}
            sx={{ minWidth: 140 }}
          >
            {deletingCardId !== null ? (
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ color: isDarkMode ? "white" : "inherit" }}
              />
            ) : (
              "Delete"
            )}
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
        aria-labelledby="add-edit-card-dialog-title"
      >
        <DialogTitle id="add-edit-card-dialog-title" fontWeight={700}>
          {isEditing ? "Edit ID Card" : "Add New ID Card"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} mt={0.5}>
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
                  size="medium"
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
                  size="medium"
                  sx={{
                    input: { color: theme.palette.text.primary },
                    bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                  }}
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
                size="medium"
                sx={{
                  input: { color: theme.palette.text.primary },
                  bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullname"
                value={cardForm.fullname}
                onChange={handleChange}
                size="medium"
                sx={{
                  input: { color: theme.palette.text.primary },
                  bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                }}
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
                size="medium"
                sx={{
                  input: { color: theme.palette.text.primary },
                  bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                }}
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
                size="medium"
                sx={{
                  input: { color: theme.palette.text.primary },
                  bgcolor: isDarkMode ? theme.palette.background.default : "inherit",
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} size="large" variant="outlined" disabled={buttonDisabled}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCard}
            disabled={buttonDisabled}
            size="large"
            sx={{ minWidth: 140, position: "relative" }}
          >
            {buttonDisabled ? (
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ color: isDarkMode ? "white" : "inherit" }}
              />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Card"
            )}
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

export default Cards;
