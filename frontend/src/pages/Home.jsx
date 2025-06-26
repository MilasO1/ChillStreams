import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ClientHeader from '../components/ClientHeader';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import './Home.css';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('userLogout', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogout', handleStorageChange);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/videos');
      setVideos(data);
      
      // extract genres from videos
      const uniqueGenres = [...new Set(data.map(video => video.genre))];
      setGenres(['All', ...uniqueGenres]);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await axiosInstance.get('/users/profile');
        setUser(data);
      } else {
        setUser(null); // clear user state if no token
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setUser(null); // clear user state on error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // clear user state
    
    // dispatch logout event to the headers
    window.dispatchEvent(new Event('userLogout'));
    
    navigate('/login');
  };

  // grouped by genre 
  const getVideosByGenre = () => {
    const videosByGenre = {};
    
    //To do : query search via mongodb in the backend
    genres.forEach(genre => {
      if (genre !== 'All') {
        videosByGenre[genre] = videos.filter(video => video.genre === genre);
      }
    });
    
    return videosByGenre;
  };

  // filter videos for a specific genre 
  const filteredVideos = selectedGenre === 'All' 
    ? videos 
    : videos.filter(video => video.genre === selectedGenre);

  if (loading) return (
    <div className="home-page">
      {user && user.isAdmin ? <Header onLogout={handleLogout} /> : <ClientHeader onLogout={handleLogout} />}
      <main className="home-content">
        <Loader />
      </main>
    </div>
  );

  if (error) return (
    <div className="home-page">
      {user && user.isAdmin ? <Header onLogout={handleLogout} /> : <ClientHeader onLogout={handleLogout} />}
      <main className="home-content">
        <Message variant="danger">{error}</Message>
      </main>
    </div>
  );

  const featuredVideo = videos.length > 0 ? videos[Math.floor(Math.random() * videos.length)] : null;
  const videosByGenre = getVideosByGenre();

  return (
    <div className="home-page">
      {user && user.isAdmin ? <Header onLogout={handleLogout} /> : <ClientHeader onLogout={handleLogout} />}
      <main className="home-content">
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

        {/* show genre-specific videos when a genre is selected */}
        {selectedGenre !== 'All' ? (
          <section className="video-carousel-section">
            <h2 className="section-title">{selectedGenre}</h2>
            {filteredVideos.length === 0 ? (
              <Message>No videos found in this category.</Message>
            ) : (
              <div className="video-carousel">
                {filteredVideos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* show all genres when "All" is selected */
          Object.entries(videosByGenre).map(([genre, genreVideos]) => (
            genreVideos.length > 0 && (
              <section key={genre} className="video-carousel-section category-row">
                <h2 className="section-title">{genre}</h2>
                <div className="video-carousel">
                  {genreVideos.map(video => (
                    <VideoCard key={video._id} video={video} />
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