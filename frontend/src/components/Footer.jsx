import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} Chillstreams. All rights reserved.
          </div>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
    </footer>
  );
}

export default Footer;