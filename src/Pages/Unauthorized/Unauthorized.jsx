import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorized.css'; // You can share the CSS or create a separate notfound.css

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">🔍</div>
        <h1 className="unauthorized-title">404 - Page Not Found</h1>
        <p className="unauthorized-message">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <div className="unauthorized-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/UsersLogin')}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;