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
      
      if (videoFile) formData.append('video', videoFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      
      if (videoToEdit) {
        await axiosInstance.put(`/videos/${videoToEdit._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.post('/videos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
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
    <div className="video-form-container">
      <h2>{videoToEdit ? 'Edit Video' : 'Add New Video'}</h2>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="video-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
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
        
        <div className="form-group">
          <label htmlFor="video">
            Video File {videoToEdit && '(Leave blank to keep current video)'}
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required={!videoToEdit}
          />
          <div className="form-hint">Max size: 500MB</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="thumbnail">
            Thumbnail {videoToEdit && '(Leave blank to keep current thumbnail)'}
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            required={!videoToEdit}
          />
          
          {thumbnailPreview && (
            <div className="thumbnail-preview">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview"
              />
            </div>
          )}
        </div>
        
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