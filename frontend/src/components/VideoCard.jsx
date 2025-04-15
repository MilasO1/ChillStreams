import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './VideoCard.css';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`} className="video-link">
        <div className="thumbnail-container">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="video-thumbnail"
          />
        </div>
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
          <span className="video-genre">{video.genre}</span>
        </div>
      </Link>
    </div>
  );
}

// VideoCard.propTypes = {
//   video: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     thumbnail: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     genre: PropTypes.string.isRequired
//   }).isRequired
// };

export default VideoCard;