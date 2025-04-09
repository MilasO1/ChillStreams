// src/pages/AdminDashboard.jsx
import Header from '../components/Header';
import VideoList from '../components/VideoList';

function AdminDashboard() {
  return (
    <div>
      <Header />
      <div className="container mt-4">
        <VideoList />
      </div>
    </div>
  );
}

export default AdminDashboard;