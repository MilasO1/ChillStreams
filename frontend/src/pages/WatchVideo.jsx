import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import VideoCard from '../components/VideoCard';
import './WatchVideo.css';

function WatchVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const fetchVideoData = useCallback(async () => {
    try {
      setLoading(true);
      setIsPlayerReady(false);
      setError('');

      const [videoResponse, allVideosResponse] = await Promise.all([
        axiosInstance.get(`/videos/${id}`),
        axiosInstance.get('/videos')
      ]);

      setVideo(videoResponse.data);
      setAllVideos(allVideosResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video data');
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideoData();
    window.scrollTo(0, 0);
  }, [fetchVideoData]);

  // memoized videos calculation
  const relatedVideos = useMemo(() => {
    if (!video || !allVideos.length) return [];
    return allVideos
      .filter(v => v.genre === video.genre && v._id !== video._id)
      .slice(0, 6);
  }, [video, allVideos]);

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
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
        <button 
          onClick={fetchVideoData}
          className="retry-button"
        >
          Retry
        </button>
      </main>
    </div>
  );

  if (!video) return (
    <div className="watch-page">
      <ClientHeader />
      <main className="watch-content">
        <Message variant="info">Video not found</Message>
      </main>
    </div>
  );

  return (
    <div className="watch-page">
      <ClientHeader />
      <main className="watch-content">
        <div className="video-layout-container">
          {/* Main Video Column */}
          <div className="main-video-column">
            {!isPlayerReady && (
              <div className="player-loading">
                <div className="player-loading-spinner"></div>
              </div>
            )}
            <VideoPlayer 
              url={video.url} 
              onReady={handlePlayerReady}
            />
          
            <div className="video-info-section">
              <h1 className="video-title">{video.title}</h1>
              <div className="video-meta-data">
                <span className="video-views">{video.views} views</span>
                <span className="video-date">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
                <span className="video-genre">{video.genre}</span>
              </div>
              
              <div className="video-actions">
                <button className="action-button like-button">
                  <i className="action-icon">👍</i> Like
                </button>
                <button className="action-button save-button">
                  <i className="action-icon">💾</i> Save
                </button>
                <button className="action-button share-button">
                  <i className="action-icon">↗️</i> Share
                </button>
              </div>
              
              <div className="video-description">
                <p>{video.description}</p>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="related-videos-sidebar">
            <h3 className="sidebar-title">Related Videos</h3>
            <div className="related-videos-list">
              {relatedVideos.length > 0 ? (
                relatedVideos.map(video => (
                  <div key={video._id} className="related-video-item">
                    <VideoCard video={video} />
                  </div>
                ))
              ) : (
                <p className="no-related">No related videos found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WatchVideo;