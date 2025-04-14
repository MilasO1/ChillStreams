import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import VideoForm from '../components/VideoForm';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axiosInstance from '../utils/axiosConfig';
import './AdminVideoEdit.css';

function AdminVideoEdit() {
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
        setError(err.response?.data?.message || 'Failed to fetch video details');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return (
    <div className="admin-video-edit">
      <Header />
      <main className="admin-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="admin-video-edit">
      <Header />
      <main className="admin-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  return (
    <div className="admin-video-edit">
      <Header />
      <main className="admin-content">
        <VideoForm videoToEdit={video} />
      </main>
    </div>
  );
}

export default AdminVideoEdit;