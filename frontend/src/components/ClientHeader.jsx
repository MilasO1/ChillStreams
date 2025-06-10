import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ClientHeader.css';

function ClientHeader({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  const isLoggedIn = !!localStorage.getItem('token');

   useEffect (() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Use the logout handler from parent
    } else {
      // fallback if no onLogout prop provided
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`client-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="client-header-container">
        <div className="client-header-logo">
          <Link to="/">
            <h2>ChillStreams</h2>
          </Link>
        </div>
        
        <form className="client-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <span className="search-icon">🔍</span>
          </button>
        </form>
        
        <button 
          className={`burger-menu-button ${menuOpen ? 'burger-menu-active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`client-nav-buttons ${menuOpen ? 'active' : ''}`}>
          <Link to="/browse" className="nav-button" onClick={handleNavClick}>
            Browse
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-button" onClick={handleNavClick}>
                Profile
              </Link>
              <button onClick={() => {handleLogout(); handleNavClick();}} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button" onClick={handleNavClick}>
                Login
              </Link>
              <Link to="/register" className="nav-button primary" onClick={handleNavClick}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;