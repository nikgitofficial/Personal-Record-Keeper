import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, CircularProgress, Grid, Paper, IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "../api/axios";

const UserFileUploader = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await axios.post("/files/upload", formData);
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Cloudinary File Upload</Typography>

      <Box display="flex" gap={2} alignItems="center">
        <input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Uploaded Files</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {files.map((file) => (
              <Grid item key={file._id} xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2, wordBreak: "break-all" }}>
                  <Typography variant="subtitle2">{file.originalname}</Typography>
                  <Typography variant="body2" color="text.secondary">{(file.size / 1024).toFixed(2)} KB</Typography>
                  <a href={file.secure_url} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UserFileUploader;
