// src/components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none">
          <h2>VideoStream Admin</h2>
        </Link>
        <nav>
          <ul className="d-flex list-unstyled m-0">
            <li className="mx-2">
              <Link to="/admin" className="text-white">Dashboard</Link>
            </li>
            <li className="mx-2">
              <Link to="/admin/videos/add" className="text-white">Add Video</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;