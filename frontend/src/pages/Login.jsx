// Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data } = await axiosInstance.post('/users/login', {
        email,
        password,
        recaptchaToken
      });
      
      // check if 2FA is required, work in progress
      if (data.requires2FA) {
        setRequires2FA(true);
        setUserId(data.userId);
      } else {
        // normal login
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // check if user = admin and redirect accordingly
        if (data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  //placeholder for now, keeping this logic, gotta work on backend
  const handle2FASuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    if (data.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <ClientHeader />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                placeholder=""
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            
            <div className="recaptcha-container">
              {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              ) : (
                <div className="recaptcha-error">
                  reCAPTCHA site key not configured. Please check your environment variables.
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="register-link">
              Don't have an account yet? <Link to="/register">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* 2FA Modal */}
      {requires2FA && (
        <TwoFactorModal 
          userId={userId}
          onSuccess={handle2FASuccess}
          onClose={() => setRequires2FA(false)}
        />
      )}
    </div>
  );
}

export default Login;