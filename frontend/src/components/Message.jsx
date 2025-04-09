// src/components/Message.jsx
function Message({ variant = 'info', children }) {
    return (
      <div className={`alert alert-${variant}`} role="alert">
        {children}
      </div>
    );
  }
  
  export default Message;