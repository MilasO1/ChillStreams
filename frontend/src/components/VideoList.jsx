import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Loader from './Loader';
import Message from './Message';
import './VideoList.css';

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
        setVideos(videos.filter(video => video._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete video');
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="video-list-container">
      <div className="video-list-header">
        <h2>Videos Library</h2>
        <Link to="/admin/videos/add" className="add-video-button">
          Add New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <Message>No videos found. Add your first video!</Message>
      ) : (
        <div className="video-table-container">
          <table className="video-table">
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
                      className="video-thumbnail"
                    />
                  </td>
                  <td>{video.title}</td>
                  <td>{video.genre}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="video-actions">
                      <Link 
                        to={`/video/${video._id}`} 
                        className="action-button view"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/videos/edit/${video._id}`} 
                        className="action-button edit"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteVideo(video._id)} 
                        className="action-button delete"
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