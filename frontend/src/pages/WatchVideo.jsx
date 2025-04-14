import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import RelatedVideos from '../components/RelatedVideos';
import './WatchVideo.css';

function WatchVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    fetchVideo();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/videos/${id}`);
      setVideo(data);
      
      // Fetch related videos
      const { data: allVideos } = await axiosInstance.get('/videos');
      const related = allVideos
        .filter(v => v.genre === data.genre && v._id !== data._id)
        .slice(0, 4);
      setRelatedVideos(related);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="watch-page">
      <ClientHeader />
      <main className="watch-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="watch-page">
      <ClientHeader />
      <main className="watch-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  return (
    <div className="watch-page">
      <ClientHeader />
      <main className="watch-content">
        <div className="video-container">
          {/* Main Video Section */}
          <div className="main-video">
            <div className="video-player-wrapper">
              <VideoPlayer url={video.url} />
            </div>
            
            <div className="video-info">
              <h1 className="video-title">{video.title}</h1>
              <div className="video-meta">
                <span className="video-genre">{video.genre}</span>
                <span className="video-date">
                  Added on {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="video-description">
                <h2>Description</h2>
                <p>{video.description}</p>
              </div>
            </div>
          </div>
          
          {/* Related Videos Section */}
          <div className="related-videos">
            <h3 className="related-title">Related Videos</h3>
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default WatchVideo;