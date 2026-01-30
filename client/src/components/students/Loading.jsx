// Loading.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Loading() {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-text">Loading your course content...</div>
      <div className="loading-subtext">Please wait a moment</div>
    </div>
  );
}

export default Loading;
