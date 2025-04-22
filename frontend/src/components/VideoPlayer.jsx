import ReactPlayer from 'react-player';
import './VideoPlayer.css';

function VideoPlayer({ url, onReady }) {
  return (
    <div className="video-player-container">
      <ReactPlayer
        url={url}
        className="react-player"
        width="100%"
        height="100%"
        controls
        onReady={onReady}
      />
    </div>
  );
}

export default VideoPlayer;