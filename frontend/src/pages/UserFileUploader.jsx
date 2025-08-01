import { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  Box, Button, TextField, Typography, List, ListItem, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const UserFileUploader = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await axios.get('/files');
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    await axios.post('/files/upload', formData);
    setFile(null);
    setDescription('');
    fetchFiles();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/files/${id}`);
    fetchFiles();
  };

  return (
    <Box>
      <Typography variant="h6">Upload File</Typography>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleUpload}>Upload</Button>

      <Typography variant="h6" sx={{ mt: 4 }}>Your Files</Typography>
      <List>
        {files.map(f => (
          <ListItem key={f._id}>
            <a href={f.fileUrl} target="_blank" rel="noopener noreferrer">{f.fileName}</a>
            <IconButton onClick={() => handleDelete(f._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserFileUploader;
