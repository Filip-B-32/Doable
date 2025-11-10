import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="animated-background">
      <div className="sun"></div>
      <div className="stars"></div>
      <div className="horizon-glow"></div>
      <div className="container">
        <div className="wave-group">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
          <div className="wave wave-4"></div>
          <div className="interference interference-1"></div>
          <div className="interference interference-2"></div>
          <div className="interference interference-3"></div>
        </div>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
