import Header from '../components/Header';
import VideoForm from '../components/VideoForm';
import './AdminVideoAdd.css';

function AdminVideoAdd() {
  return (
    <div className="admin-video-add">
      <Header />
      <main className="admin-content">
        <VideoForm />
      </main>
    </div>
  );
}

export default AdminVideoAdd;