import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Section Navigation */}
          <div className="footer-section">
            <h3 className="footer-title">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/catalogue">Catalogue</Link></li>
              <li><Link to="/abonnements">Abonnements</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Section Légale */}
          <div className="footer-section">
            <h3 className="footer-title">Légal</h3>
            <ul className="footer-links">
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/politique-confidentialite">Politique de confidentialité</Link></li>
              <li><Link to="/cookies">Politique des cookies</Link></li>
              <li><Link to="/conditions-generales">CGU</Link></li>
            </ul>
          </div>

          {/* Section Contact */}
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <address className="footer-contact">
              <p>Chillstreams SAS</p>
              <p>123 Rue du Streaming</p>
              <p>75000 Paris, France</p>
              <p>Email: <a href="mailto:contact@chillstreams.com">contact@chillstreams.com</a></p>
              <p>Tél: <a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
            </address>
          </div>

          {/* Section Réseaux Sociaux */}
          <div className="footer-section">
            <h3 className="footer-title">Suivez-nous</h3>
            <div className="social-links">
              <a href="https://facebook.com/chillstreams" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com/chillstreams" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com/chillstreams" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com/chillstreams" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright et RGPD */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; {currentYear} Chillstreams - Tous droits réservés</p>
            <p>
              <Link to="/protection-donnees">Protection des données personnelles</Link> | 
              <Link to="/cookies">Préférences cookies</Link>
            </p>
          </div>
          <div className="footer-compliance">
            <img 
              src="/images/cnil-logo.png" 
              alt="Conforme à la CNIL" 
              className="compliance-logo"
            />
            <span className="rgpd-badge">RGPD Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;