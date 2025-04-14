import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ClientHeader.css';

function ClientHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="client-header">
      <div className="client-header-container">
        {/* Logo */}
        <div className="client-header-logo">
          <Link to="/">
            <h2>ChillStreams</h2>
          </Link>
        </div>
        
        {/* Search Bar */}
        <form className="client-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <span className="search-icon">🔍</span>
          </button>
        </form>
        
        {/* Navigation */}
        <div className="client-nav-buttons">
          <Link to="/browse" className="nav-button">
            Browse
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-button">
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button primary">
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