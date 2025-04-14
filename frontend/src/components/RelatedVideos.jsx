import { Link } from 'react-router-dom';
import './RelatedVideos.css';

function RelatedVideos({ videos }) {
  if (!videos || videos.length === 0) {
    return <p className="no-videos">No related videos found.</p>;
  }

  return (
    <div className="related-videos-container">
      {videos.map(video => (
        <Link 
          key={video._id} 
          to={`/watch/${video._id}`}
          className="related-video-card"
        >
          <div className="video-thumbnail-container">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="related-video-thumbnail"
            />
          </div>
          <div className="video-info">
            <h3 className="video-title">{video.title}</h3>
            <span className="video-genre">{video.genre}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default RelatedVideos;