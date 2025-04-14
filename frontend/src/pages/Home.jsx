import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ClientHeader from '../components/ClientHeader';
import './Home.css';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/videos');
      setVideos(data);
      
      const uniqueGenres = [...new Set(data.map(video => video.genre))];
      setGenres(['All', ...uniqueGenres]);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  // Get videos grouped by genre (for Netflix-style category rows)
  const getVideosByGenre = () => {
    const videosByGenre = {};
    
    genres.forEach(genre => {
      if (genre !== 'All') {
        videosByGenre[genre] = videos.filter(video => video.genre === genre);
      }
    });
    
    return videosByGenre;
  };

  const filteredVideos = selectedGenre === 'All' 
    ? videos 
    : videos.filter(video => video.genre === selectedGenre);

  if (loading) return (
    <div className="home-page">
      <ClientHeader />
      <main className="home-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="home-page">
      <ClientHeader />
      <main className="home-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const videosByGenre = getVideosByGenre();

  return (
    <div className="home-page">
      <ClientHeader />
      <main className="home-content">
        {/* Hero Section */}
        {featuredVideo && (
          <section className="hero-section">
            <div className="hero-container">
              <img 
                src={featuredVideo.thumbnail} 
                alt={featuredVideo.title}
                className="hero-image"
              />
              <div className="hero-overlay">
                <h1 className="hero-title">{featuredVideo.title}</h1>
                <p className="hero-description">
                  {featuredVideo.description.length > 100 
                    ? `${featuredVideo.description.substring(0, 100)}...` 
                    : featuredVideo.description}
                </p>
                <Link to={`/watch/${featuredVideo._id}`} className="hero-button">
                  Watch Now
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Genre Filter */}
        <section className="genre-filter">
          <div className="filter-container">
            {genres.map(genre => (
              <button 
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`filter-button ${selectedGenre === genre ? 'active' : ''}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Selected Genre Videos (Horizontal Carousel) */}
        {selectedGenre !== 'All' ? (
          <section className="video-carousel-section">
            <h2 className="section-title">{selectedGenre}</h2>
            {filteredVideos.length === 0 ? (
              <Message>No videos found in this category.</Message>
            ) : (
              <div className="video-carousel">
                {filteredVideos.map(video => (
                  <div key={video._id} className="video-card">
                    <Link to={`/watch/${video._id}`} className="video-link">
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
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          // Netflix-style multiple category rows when "All" is selected
          Object.entries(videosByGenre).map(([genre, videos]) => (
            videos.length > 0 && (
              <section key={genre} className="category-row video-carousel-section">
                <h2 className="section-title">{genre}</h2>
                <div className="video-carousel">
                  {videos.map(video => (
                    <div key={video._id} className="video-card">
                      <Link to={`/watch/${video._id}`} className="video-link">
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
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))
        )}
      </main>
    </div>
  );
}

export default Home;