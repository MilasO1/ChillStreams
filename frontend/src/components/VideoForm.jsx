// src/components/VideoForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

function VideoForm({ videoToEdit }) {
  const [title, setTitle] = useState(videoToEdit?.title || '');
  const [description, setDescription] = useState(videoToEdit?.description || '');
  const [genre, setGenre] = useState(videoToEdit?.genre || 'Action');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // For displaying a preview of the thumbnail
  const [thumbnailPreview, setThumbnailPreview] = useState(videoToEdit?.thumbnail || '');
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      
      if (videoFile) {
        formData.append('video', videoFile);
      }
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      
      let response;
      
      if (videoToEdit) {
        // Update existing video
        response = await axiosInstance.put(`/videos/${videoToEdit._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new video
        response = await axiosInstance.post('/videos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      setLoading(false);
      navigate('/admin');
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  
  const genreOptions = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'];

  return (
    <div className="container mt-4">
      <h2>{videoToEdit ? 'Edit Video' : 'Add New Video'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        {/* Genre */}
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <select
            className="form-select"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            {genreOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Video File */}
        <div className="mb-3">
          <label htmlFor="video" className="form-label">
            Video File {videoToEdit && '(Leave blank to keep current video)'}
          </label>
          <input
            type="file"
            className="form-control"
            id="video"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required={!videoToEdit}
          />
          <div className="form-text">Max size: 500MB</div>
        </div>
        
        {/* Thumbnail */}
        <div className="mb-3">
          <label htmlFor="thumbnail" className="form-label">
            Thumbnail {videoToEdit && '(Leave blank to keep current thumbnail)'}
          </label>
          <input
            type="file"
            className="form-control"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            required={!videoToEdit}
          />
          
          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div className="mt-2">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                style={{ maxHeight: '150px', maxWidth: '100%' }} 
              />
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : videoToEdit ? 'Update Video' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}

export default VideoForm;