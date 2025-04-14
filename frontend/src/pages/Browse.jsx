import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './Browse.css';

function Browse() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [videosByGenre, setVideosByGenre] = useState({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/videos');
      setVideos(data);
      
      const uniqueGenres = [...new Set(data.map(video => video.genre))];
      setGenres(uniqueGenres);
      
      const grouped = uniqueGenres.reduce((acc, genre) => {
        acc[genre] = data.filter(video => video.genre === genre);
        return acc;
      }, {});
      
      setVideosByGenre(grouped);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="browse-page">
      <ClientHeader />
      <main className="browse-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="browse-page">
      <ClientHeader />
      <main className="browse-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  return (
    <div className="browse-page">
      <ClientHeader />
      <main className="browse-content">
        <h1 className="browse-title">Browse Videos</h1>
        
        {genres.length === 0 ? (
          <Message>No videos available.</Message>
        ) : (
          genres.map(genre => (
            <section key={genre} className="genre-section">
              <div className="genre-header">
                <h2 className="genre-title">{genre}</h2>
              </div>
              
              <div className="video-grid">
                {videosByGenre[genre].map(video => (
                  <Link key={video._id} to={`/watch/${video._id}`} className="video-card">
                    <div className="thumbnail-container">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="video-thumbnail"
                      />
                    </div>
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

export default Browse;