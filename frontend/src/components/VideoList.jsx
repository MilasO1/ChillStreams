// src/components/VideoList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Loader from './Loader';
import Message from './Message';

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/videos');
      setVideos(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axiosInstance.delete(`/videos/${id}`);
        // Update the videos list after deletion
        setVideos(videos.filter(video => video._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete video');
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Videos Library</h2>
        <Link to="/admin/videos/add" className="btn btn-primary">
          Add New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <Message>No videos found. Add your first video!</Message>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id}>
                  <td>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      style={{ width: '80px', height: '45px', objectFit: 'cover' }} 
                    />
                  </td>
                  <td>{video.title}</td>
                  <td>{video.genre}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link 
                        to={`/video/${video._id}`} 
                        className="btn btn-sm btn-info me-2"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/videos/edit/${video._id}`} 
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteVideo(video._id)} 
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VideoList;