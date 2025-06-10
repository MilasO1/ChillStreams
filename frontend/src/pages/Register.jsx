// Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import ReCAPTCHA from 'react-google-recaptcha';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Log data for debugging
      console.log('Sending registration data:', {
        name,
        email,
        password: '[HIDDEN]',
        recaptchaToken: recaptchaToken ? '[TOKEN_PROVIDED]' : '[NO_TOKEN]'
      });
      
      const { data } = await axiosInstance.post('/users/register', {
        name,
        email,
        password,
        recaptchaToken
      });
      
      console.log('Registration successful:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      navigate('/');
      
    } catch (err) {
      setLoading(false);
      
      // Enhanced error logging
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // More detailed error handling, for testing
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // for different error formats, work in progress
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.error) {
          setError(errorData.error);
        } else if (errorData.errors) {
          // Handle validation errors array
          const errorMessages = Array.isArray(errorData.errors) 
            ? errorData.errors.map(e => e.msg || e.message || e).join(', ')
            : JSON.stringify(errorData.errors);
          setError(errorMessages);
        } else {
          setError('Registration failed - ' + JSON.stringify(errorData));
        }
      } else {
        setError('Registration failed - Network error or server unavailable');
      }
    }
  };

  return (
    <div className="register-page">
      <ClientHeader />
      <main className="register-content">
        <div className="register-card">
          <h2 className="register-title">Create an Account</h2>
          
          {error && <div className="register-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <input
                type="text"
                id="name"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
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
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;