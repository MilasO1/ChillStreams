import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h2>VideoStream Admin</h2>
        </Link>
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/videos/add">Add Video</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;