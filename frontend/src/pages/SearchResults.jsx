import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/videos');
      
      const filteredVideos = data.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.genre.toLowerCase().includes(query.toLowerCase())
      );
      
      setVideos(filteredVideos);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search videos');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="search-page">
      <ClientHeader />
      <main className="search-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="search-page">
      <ClientHeader />
      <main className="search-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  return (
    <div className="search-page">
      <ClientHeader />
      <main className="search-content">
        <h2 className="search-title">Search Results for "{query}"</h2>
        <p className="search-count">{videos.length} results found</p>
        
        {videos.length === 0 ? (
          <Message>No videos matching your search.</Message>
        ) : (
          <div className="search-grid">
            {videos.map(video => (
              <Link key={video._id} to={`/watch/${video._id}`} className="search-card">
                <div className="thumbnail-container">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="video-thumbnail"
                  />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <span className="video-genre">{video.genre}</span>
                  <p className="video-description">
                    {video.description.substring(0, 80)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;