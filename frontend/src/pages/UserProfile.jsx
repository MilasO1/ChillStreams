import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import ClientHeader from '../components/ClientHeader';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './UserProfile.css';

// Constants
const DEFAULT_AVATAR = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Password validation
const validatePassword = (password) => {
  if (!password) return { isValid: true, message: '' }; // Optional field
  
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!minLength) return { isValid: false, message: 'Password must be at least 8 characters long' };
  if (!hasUpperCase) return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  if (!hasLowerCase) return { isValid: false, message: 'Password must contain at least one lowercase letter' };  
  if (!hasNumbers) return { isValid: false, message: 'Password must contain at least one number' };
  if (!hasSpecialChar) return { isValid: false, message: 'Password must contain at least one special character' };
  
  return { isValid: true, message: '' };
};

function UserProfile() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [originalData, setOriginalData] = useState({
    name: '',
    email: ''
  });
  
  // File handling
  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState(DEFAULT_AVATAR);
  const [imageLoading, setImageLoading] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' });
  
  const navigate = useNavigate();
  const fileReaderRef = useRef(null);
  
  // Check if form has unsaved changes
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.password !== '' ||
      profilePic !== null
    );
  };
  
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/users/profile');
      
      const userData = {
        name: data.name || '',
        email: data.email || ''
      };
      
      setFormData({
        ...userData,
        password: '',
        confirmPassword: ''
      });
      setOriginalData(userData);
      setPicPreview(data.pic || DEFAULT_AVATAR);
      
    } catch (err) {
      setError('Failed to load profile. Please login again.');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
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
  
  // Cleanup file reader on unmount
  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
    };
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate password in real-time
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };
  
  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setImageLoading(true);
      setError('');
      
      // Clean up previous reader
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
      
      const reader = new FileReader();
      fileReaderRef.current = reader;
      
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          setProfilePic(file);
          setPicPreview(reader.result);
          setImageLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read image file');
        setImageLoading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (err) {
      setError('Failed to process image', err);
      setImageLoading(false);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setPicPreview(DEFAULT_AVATAR);
    
    // Reset file input
    const fileInput = document.getElementById('profilePic');
    if (fileInput) fileInput.value = '';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate password if provided
      if (formData.password) {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.message);
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('email', formData.email.trim());
      
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      if (profilePic) {
        formDataToSend.append('pic', profilePic);
      }

      const { data } = await axiosInstance.put('/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update local storage and original data
      localStorage.setItem('user', JSON.stringify(data));
      setOriginalData({
        name: data.name,
        email: data.email
      });
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setProfilePic(null);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="profile-page">
        <ClientHeader />
        <main className="profile-content">
          <Loader />
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ClientHeader />
      <main className="profile-content">
        <div className="profile-card">
          <h2 className="profile-title">Your Profile</h2>
          
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">{success}</Message>}
          
          <div className="profile-pic-container">
            <div className="profile-pic-wrapper">
              {imageLoading && <div className="image-loader">Processing...</div>}
              <img 
                src={picPreview} 
                alt="Profile" 
                className="profile-pic"
                onError={(e) => {
                  if (e.target.src !== DEFAULT_AVATAR) {
                    e.target.src = DEFAULT_AVATAR;
                  }
                }}
              />
            </div>
            <div className="profile-pic-controls">
              <label htmlFor="profilePic" className="profile-pic-edit">
                {imageLoading ? 'Processing...' : 'Change Photo'}
                <input
                  type="file"
                  id="profilePic"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePicChange}
                  className="profile-pic-input"
                  disabled={imageLoading}
                />
              </label>
              <button 
                type="button" 
                className="profile-pic-remove"
                onClick={removeProfilePic}
                disabled={imageLoading}
              >
                Remove
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name" className="input-label"></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
                maxLength="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="input-label"></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                maxLength="255"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="input-label">
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={!passwordValidation.isValid ? 'error' : ''}
              />
              {!passwordValidation.isValid && (
                <span className="validation-error">{passwordValidation.message}</span>
              )}
            </div>

            {formData.password && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="input-label"></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className={formData.password !== formData.confirmPassword && formData.confirmPassword ? 'error' : ''}
                />
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <span className="validation-error">Passwords do not match</span>
                )}
              </div>
            )}
            
            <button 
              type="submit" 
              className={`update-button ${hasChanges() ? 'has-changes' : ''}`}
              disabled={loading || imageLoading || !passwordValidation.isValid}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  Update Profile
                  {hasChanges() && <span className="changes-indicator"></span>}
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;