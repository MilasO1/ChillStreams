// src/pages/AdminVideoAdd.jsx
import Header from '../components/Header';
import VideoForm from '../components/VideoForm';

function AdminVideoAdd() {
  return (
    <div>
      <Header />
      <div className="container mt-4">
        <VideoForm />
      </div>
    </div>
  );
}

export default AdminVideoAdd;