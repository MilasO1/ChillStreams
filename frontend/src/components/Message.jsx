import './Message.css';

function Message({ variant = 'info', children }) {
  return (
    <div className={`message ${variant}`}>
      {children}
    </div>
  );
}

export default Message;