import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import SearchResults from './pages/SearchResults';
import WatchVideo from './pages/WatchVideo';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminVideoAdd from './pages/AdminVideoAdd';
import AdminVideoEdit from './pages/AdminVideoEdit';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Client routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/watch/:id" element={<WatchVideo />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/videos/add" element={<PrivateRoute><AdminVideoAdd /></PrivateRoute>} />
          <Route path="/admin/videos/edit/:id" element={<PrivateRoute><AdminVideoEdit /></PrivateRoute>} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;