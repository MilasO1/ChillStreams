useEffect(() => {
    if (!loading && !error) {
      updateMetaTags();
      updateStructuredData();
    }
  }, [selectedGenre, videos, loading, error]);

  const updateStructuredData = () => {
    // Supprimer les anciens scripts de données structurées
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Données structurées pour le site
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "VidStream",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Données structurées pour la collection de vidéos
    const videoCollectionStructuredData = videos.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "VideoGallery",
      "name": "Collection de Vidéos Streaming",
      "description": `Découvrez notre collection de vidéos en streaming. Films, séries, documentaires et plus encore.`,
      "numberOfItems": videos.length,
      "video": videos.slice(0, 10).map(video => ({
        "@type": "VideoObject",
        "name": video.title,
        "description": video.description,
        "thumbnailUrl": video.thumbnail,
        "uploadDate": video.createdAt,
        "genre": video.genre
      }))
    } : null;

    // Ajouter les scripts au head
    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script1);

    if (videoCollectionStructuredData) {
      const script2 = document.createElement('script');
      script2.type = 'application/ld+json';
      script2.textContent = JSON.stringify(videoCollectionStructuredData);
      document.head.appendChild(script2);
    }
  };import { useState, useEffect } from 'react';
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
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    window.dispatchEvent(new Event('userLogout'));
    navigate('/login');
  };

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

  // SEO Meta data management
  const updateMetaTags = () => {
    const siteName = "VidStream"; // Remplacez par le nom de votre site
    const baseTitle = `${siteName} - Streaming de Vidéos en Ligne`;
    const baseDescription = `Découvrez notre collection de vidéos en streaming. Films, séries, documentaires et plus encore. Regardez vos contenus favoris en haute qualité.`;
    
    let title = baseTitle;
    let description = baseDescription;
    
    if (selectedGenre !== 'All') {
      title = `${selectedGenre} - ${siteName}`;
      description = `Explorez notre collection de vidéos ${selectedGenre.toLowerCase()}. Streaming gratuit et en haute qualité sur ${siteName}.`;
    }
    
    const keywords = [
      'streaming vidéo',
      'films en ligne',
      'séries streaming',
      'vidéos HD',
      ...genres.filter(g => g !== 'All')
    ].join(', ');

    // Mise à jour du titre de la page
    document.title = title;
    
    // Mise à jour des meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:site_name', siteName, 'property');
    
    // Twitter tags
    updateMetaTag('twitter:title', title, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:card', 'summary_large_image', 'property');
    
    // Si on a une vidéo mise en avant, ajouter son image
    if (featuredVideo) {
      updateMetaTag('og:image', featuredVideo.thumbnail, 'property');
      updateMetaTag('twitter:image', featuredVideo.thumbnail, 'property');
    }
  };
  
  const updateMetaTag = (name, content, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const featuredVideo = videos.length > 0 ? videos[Math.floor(Math.random() * videos.length)] : null;
  const videosByGenre = getVideosByGenre();

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VidStream",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const videoCollectionStructuredData = videos.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "name": "Collection de Vidéos Streaming",
    "description": description,
    "numberOfItems": videos.length,
    "video": videos.slice(0, 10).map(video => ({
      "@type": "VideoObject",
      "name": video.title,
      "description": video.description,
      "thumbnailUrl": video.thumbnail,
      "uploadDate": video.createdAt,
      "genre": video.genre
    }))
  } : null;

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

  return (
    <div className="home-page">
      {user && user.isAdmin ? <Header onLogout={handleLogout} /> : <ClientHeader onLogout={handleLogout} />}
      
      <main className="home-content">
        {featuredVideo && (
          <section className="hero-section">
            <div className="hero-container">
              <img 
                src={featuredVideo.thumbnail} 
                alt={`${featuredVideo.title} - ${featuredVideo.genre}`}
                className="hero-image"
                loading="eager" // Hero image should load immediately
                fetchpriority="high"
                width="1920"
                height="1080"
              />
              <div className="hero-overlay">
                <h1 className="hero-title">{featuredVideo.title}</h1>
                <p className="hero-description">
                  {featuredVideo.description.length > 100 
                    ? `${featuredVideo.description.substring(0, 100)}...` 
                    : featuredVideo.description}
                </p>
                <Link 
                  to={`/watch/${featuredVideo._id}`} 
                  className="hero-button"
                  aria-label={`Regarder ${featuredVideo.title} maintenant`}
                >
                  Regarder Maintenant
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Genre Filter */}
        <nav className="genre-filter" role="navigation" aria-label="Filtres de genres de vidéos">
          <div className="filter-container">
            {genres.map(genre => (
              <button 
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`filter-button ${selectedGenre === genre ? 'active' : ''}`}
                aria-pressed={selectedGenre === genre}
                aria-label={`Filtrer par genre ${genre}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </nav>

        {/* Video content sections */}
        {selectedGenre !== 'All' ? (
          <section className="video-carousel-section" aria-labelledby={`genre-${selectedGenre}`}>
            <h2 id={`genre-${selectedGenre}`} className="section-title">
              {selectedGenre} ({filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''})
            </h2>
            {filteredVideos.length === 0 ? (
              <Message>Aucune vidéo trouvée dans cette catégorie.</Message>
            ) : (
              <div className="video-carousel" role="region" aria-label={`Vidéos de genre ${selectedGenre}`}>
                {filteredVideos.map((video, index) => (
                  <VideoCard 
                    key={video._id} 
                    video={video}
                    loading={index < 4 ? "eager" : "lazy"} // Load first 4 images eagerly
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          Object.entries(videosByGenre).map(([genre, genreVideos], sectionIndex) => (
            genreVideos.length > 0 && (
              <section 
                key={genre} 
                className="video-carousel-section category-row"
                aria-labelledby={`genre-section-${genre}`}
              >
                <h2 id={`genre-section-${genre}`} className="section-title">
                  {genre} ({genreVideos.length} vidéo{genreVideos.length > 1 ? 's' : ''})
                </h2>
                <div className="video-carousel" role="region" aria-label={`Vidéos de genre ${genre}`}>
                  {genreVideos.map((video, index) => (
                    <VideoCard 
                      key={video._id} 
                      video={video}
                      loading={sectionIndex === 0 && index < 4 ? "eager" : "lazy"}
                      priority={sectionIndex === 0 && index < 4}
                    />
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