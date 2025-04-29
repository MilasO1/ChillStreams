import { useState, useEffect, useCallback } from 'react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/users/profile');
      
      setName(data.name);
      setEmail(data.email);
      setPicPreview(data.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      
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
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserProfile();
  }, [navigate, fetchUserProfile]);
  
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    
    setProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPicPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setPicPreview("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate password match if changing password
      if (password && password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (profilePic) formData.append('pic', profilePic);

      const { data } = await axiosInstance.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      localStorage.setItem('user', JSON.stringify(data));
      setSuccess('Profile updated successfully');
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
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
              src={picPreview || null} 
              alt="Profile" 
              className="profile-pic"
              onError={(e) => {
                e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
              }}
            />
            <div className="profile-pic-controls">
              <label htmlFor="profilePic" className="profile-pic-edit">
                Change Photo
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handlePicChange}
                  className="profile-pic-input"
                />
              </label>
              <button 
                type="button" 
                className="profile-pic-remove"
                onClick={removeProfilePic}
              >
                Remove
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                placeholder="New password. Leave blank to keep current"
              />
            </div>

            {password && (
              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                  placeholder="Confirm your new password"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="update-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;