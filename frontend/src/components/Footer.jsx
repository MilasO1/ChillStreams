import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          <span>© {currentYear} Chillstreams</span>
          <span className="separator">•</span>
          <span>All rights reserved</span>
        </div>
        
        <nav className="legal-links">
          <Link to="/privacy" className="legal-link">Privacy Policy</Link>
          <span className="separator">•</span>
          <Link to="/terms" className="legal-link">Terms of Service</Link>
          <span className="separator">•</span>
          <Link to="/cookies" className="legal-link">Cookie Policy</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;