import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './VideoForm.css';

function VideoForm({ videoToEdit }) {
  const [title, setTitle] = useState(videoToEdit?.title || '');
  const [description, setDescription] = useState(videoToEdit?.description || '');
  const [genre, setGenre] = useState(videoToEdit?.genre || 'Action');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(videoToEdit?.thumbnail || '');
  
  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    
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
      
      // Important: Use the exact field names that multer expects
      if (videoFile) formData.append('video', videoFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        // Add timeout if needed
        timeout: 600000 // 10 minutes
      };
      
      if (videoToEdit) {
        await axiosInstance.put(`/videos/${videoToEdit._id}`, formData, config);
      } else {
        await axiosInstance.post('/videos', formData, config);
      }
      
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('Upload error:', err);
    }
  };
  
  const genreOptions = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'];

  return (
    <div className="video-form-container">
      <h2 className="form-title">{videoToEdit ? 'Edit Video' : 'Add New Video'}</h2>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="video-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre" className="form-label">Genre</label>
            <select
              id="genre"
              className="form-input"
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
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-textarea"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="video" className="form-label">
              Video File {videoToEdit && <span className="optional-text">(optional)</span>}
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="video"
                className="form-file-input"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required={!videoToEdit}
              />
              <div className="file-input-display">
                {videoFile ? videoFile.name : 'Select video file...'}
              </div>
            </div>
            <div className="form-hint">Max size: 500MB</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="thumbnail" className="form-label">
              Thumbnail {videoToEdit && <span className="optional-text">(optional)</span>}
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="thumbnail"
                className="form-file-input"
                accept="image/*"
                onChange={handleThumbnailChange}
                required={!videoToEdit}
              />
              <div className="file-input-display">
                {thumbnail ? thumbnail.name : 'Select thumbnail...'}
              </div>
            </div>
          </div>
        </div>
        
        {thumbnailPreview && (
          <div className="form-group">
            <label className="form-label">Thumbnail Preview</label>
            <div className="thumbnail-preview">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview"
              />
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : videoToEdit ? 'Update Video' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}

export default VideoForm;