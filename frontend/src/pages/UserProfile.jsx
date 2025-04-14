import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './UserProfile.css';

function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [picPreview, setPicPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserProfile();
  }, [navigate]);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/users/profile');
      
      setName(data.name);
      setEmail(data.email);
      setPicPreview(data.pic);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile. Please login again.');
      setLoading(false);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };
  
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        name,
        email,
      };
      
      if (password) {
        updateData.password = password;
      }
      
      const { data } = await axiosInstance.put('/users/profile', updateData);
      
      localStorage.setItem('user', JSON.stringify(data));
      
      setSuccess('Profile updated successfully');
      setLoading(false);
      setPassword('');
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading && !name) return (
    <div className="profile-page">
      <ClientHeader />
      <main className="profile-content">
        <Loader />
      </main>
    </div>
  );

  return (
    <div className="profile-page">
      <ClientHeader />
      <main className="profile-content">
        <div className="profile-card">
          <h2 className="profile-title">Your Profile</h2>
          
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">{success}</Message>}
          
          <div className="profile-pic-container">
            <img 
              src={picPreview || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
              alt="Profile" 
              className="profile-pic"
            />
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handlePicChange}
              />
              <div className="form-note">Note: Profile picture update feature coming soon</div>
            </div>
            
            <button 
              type="submit" 
              className="update-button"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;