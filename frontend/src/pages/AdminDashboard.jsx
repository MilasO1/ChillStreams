import Header from '../components/Header';
import VideoList from '../components/VideoList';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Header />
      <main className="admin-content">
        <VideoList />
      </main>
    </div>
  );
}

export default AdminDashboard;