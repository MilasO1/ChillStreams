import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axiosInstance from '../utils/axiosConfig';
import './VideoDetails.css';

function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        console.log('Fetching video with ID:', id); // Debug log
        
        const { data } = await axiosInstance.get(`/videos/${id}`);
        console.log('Video data received:', data); // Debug log
        
        setVideo(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err); // Debug log
        setError(err.response?.data?.message || 'Failed to fetch video');
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    } else {
      setError('No video ID provided');
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) return (
    <div className="video-details-page">
      <Header />
      <main className="video-details-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="video-details-page">
      <Header />
      <main className="video-details-content">
        <Message variant="danger">{error}</Message>
        <Link to="/admin" className="back-button">
          &larr; Back to Videos
        </Link>
      </main>
    </div>
  );

  if (!video) return (
    <div className="video-details-page">
      <Header />
      <main className="video-details-content">
        <Message variant="warning">Video not found</Message>
        <Link to="/admin" className="back-button">
          &larr; Back to Videos
        </Link>
      </main>
    </div>
  );

  return (
    <div className="video-details-page">
      <Header />
      <main className="video-details-content">
        <Link to="/admin" className="back-button">
          &larr; Back to Videos
        </Link>

        <div className="video-details-card">
          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>
            <span className="video-genre">{video.genre}</span>
            
            <div className="video-player-container">
              {video.url ? (
                <VideoPlayer url={video.url} />
              ) : (
                <div className="video-placeholder">
                  <p>No video URL available</p>
                </div>
              )}
            </div>
            
            <div className="video-description">
              <h2>Description:</h2>
              <p>{video.description || 'No description available'}</p>
            </div>
            
            <div className="video-metadata">
              <p><strong>Created:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
              {video.views && <p><strong>Views:</strong> {video.views}</p>}
            </div>
            
            <div className="video-actions">
              <Link to={`/admin/videos/edit/${video._id}`} className="edit-button">
                Edit Video
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoDetails;