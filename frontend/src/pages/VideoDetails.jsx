import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axiosInstance from '../utils/axiosConfig';
import './VideoDetails.css';

function VideoDetails() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axiosInstance.get(`/videos/${id}`);
        setVideo(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

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
              <VideoPlayer url={video.url} />
            </div>
            
            <div className="video-description">
              <h2>Description:</h2>
              <p>{video.description}</p>
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