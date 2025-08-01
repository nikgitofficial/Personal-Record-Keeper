import { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  Box, Button, CircularProgress, TextField, Typography, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const UserFileUploader = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      await axios.post("/files", formData);
      setFile(null);
      setDescription("");
      fetchFiles();
    } catch (err) {
      console.error("Upload failed", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const renderPreview = (url, filename) => {
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <img
          src={url}
          alt={filename}
          style={{ maxWidth: "100%", maxHeight: 300, marginTop: 10 }}
        />
      );
    }

    if (ext === "pdf") {
      return (
        <iframe
          src={url}
          title={filename}
          width="100%"
          height="400px"
          style={{ border: "1px solid #ccc", marginTop: "10px" }}
        />
      );
    }

    if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          title="doc-preview"
          width="100%"
          height="400px"
          style={{ border: "1px solid #ccc", marginTop: "10px" }}
        />
      );
    }

    return (
      <Typography variant="body2" color="textSecondary" mt={1}>
        No preview available. Please download to view.
      </Typography>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5">📁 Upload File</Typography>

      <Box display="flex" gap={2} my={2} flexWrap="wrap">
        <TextField
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          inputProps={{ accept: "*" }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>

      <Typography variant="h6" mt={4}>Your Files</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {files.map((f) => (
            <ListItem key={f._id} alignItems="flex-start">
              <Box flex={1}>
                <ListItemText
                  primary={f.filename}
                  secondary={f.description}
                />
                {renderPreview(f.cloudinaryUrl, f.filename)}
              </Box>
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleDelete(f._id)}>
                  <DeleteIcon />
                </IconButton>
                <Button
                  href={f.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UserFileUploader;
