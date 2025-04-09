// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminVideoAdd from './pages/AdminVideoAdd';
import AdminVideoEdit from './pages/AdminVideoEdit';
import VideoDetails from './pages/VideoDetails';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

// Import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/videos/add" element={<PrivateRoute><AdminVideoAdd /></PrivateRoute>} />
        <Route path="/admin/videos/edit/:id" element={<PrivateRoute><AdminVideoEdit /></PrivateRoute>} />

        {/* Video routes */}
        <Route path="/video/:id" element={<VideoDetails />} />
        
        {/* Default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
