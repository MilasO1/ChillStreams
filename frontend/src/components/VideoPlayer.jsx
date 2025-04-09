// src/components/VideoPlayer.jsx
import ReactPlayer from 'react-player';

function VideoPlayer({ url }) {
  return (
    <div className="player-wrapper" style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}

export default VideoPlayer;