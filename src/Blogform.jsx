import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, FormGroup, FormLabel } from '@mui/material';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // ... Same as before
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    // Do something with the selected image (if needed)
    setImage(selectedImage);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <FormGroup sx={{ marginBottom: 2 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGroup>

      <FormGroup sx={{ marginBottom: 2 }}>
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={13}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FormGroup>

      <FormGroup sx={{ marginBottom: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">Select category</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
      </FormGroup>

      <FormGroup sx={{ marginBottom: 2 }}>
        <FormLabel>Upload Thumbnail</FormLabel>
        <input
          type="file"
        />
      </FormGroup>

      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default BlogForm;
