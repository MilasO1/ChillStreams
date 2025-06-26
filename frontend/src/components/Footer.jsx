import { Link } from 'react-router-dom';
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="copyright-container">
        <span>© {currentYear} Chillstreams. All rights reserved.</span>
        <div className="legal-links">
          <Link to="/terms">General Conditions of Use</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;