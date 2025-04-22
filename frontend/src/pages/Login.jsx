import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const { data } = await axiosInstance.post('/users/login', {
        email,
        password
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      
      // Check if the user is an admin and redirect accordingly
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid credentials');
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
    </div>
  );
}

export default Login;