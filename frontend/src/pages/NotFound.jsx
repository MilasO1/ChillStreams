import { Link } from 'react-router-dom';
import ClientHeader from '../components/ClientHeader';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <ClientHeader />
      <main className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="home-button">
          Go to Homepage
        </Link>
      </main>
    </div>
  );
}

export default NotFound;