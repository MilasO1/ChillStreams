// src/pages/VideoDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axiosInstance from '../utils/axiosConfig';

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
    <div>
      <Header />
      <div className="container mt-4">
        <Loader />
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Header />
      <div className="container mt-4">
        <Message variant="danger">{error}</Message>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="mb-4">
          <Link to="/admin" className="btn btn-light">
            &larr; Back to Videos
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <h1 className="card-title">{video.title}</h1>
            <span className="badge bg-primary">{video.genre}</span>
            
            <div className="my-4">
              <VideoPlayer url={video.url} />
            </div>
            
            <div className="card-text mt-3">
              <h5>Description:</h5>
              <p>{video.description}</p>
            </div>
            
            <div className="d-flex gap-2 mt-4">
              <Link to={`/admin/videos/edit/${video._id}`} className="btn btn-warning">
                Edit Video
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetails;