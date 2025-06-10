// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './Header.css';

// function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <header className="admin-header">
//       <div className="admin-header-container">
//         <div className="admin-header-logo">
//           <Link to="/admin">
//             <h2>VideoStream Admin</h2>
//           </Link>
//         </div>
        
//         <button className="burger-menu" onClick={toggleMenu} aria-label="Toggle menu">
//           <div className="burger-icon">
//             <span></span>
//             <span></span>
//             <span></span>
//           </div>
//         </button>
        
//         <nav className={`admin-nav-menu ${menuOpen ? 'active' : ''}`}>
//           <ul className="admin-nav-list">
//             <li className="admin-nav-item">
//               <Link to="/admin" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
//             </li>
//             <li className="admin-nav-item">
//               <Link to="/" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
//             </li>
//             <li className="admin-nav-item">
//               <Link to="/admin/videos/add" className="admin-nav-link primary" onClick={() => setMenuOpen(false)}>Add Video</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Use the logout handler passed from parent
    } else {
      // Fallback if no onLogout prop provided
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-header-logo">
          <Link to="/admin">
            <h2>VideoStream Admin</h2>
          </Link>
        </div>
        
        <button className="burger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          <div className="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <nav className={`admin-nav-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <button 
                onClick={() => {handleLogout(); setMenuOpen(false);}} 
                className="admin-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </li>
            <li className="admin-nav-item">
              <Link to="/admin/videos/add" className="admin-nav-link primary" onClick={() => setMenuOpen(false)}>Add Video</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;