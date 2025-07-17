import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <span style={{ 
            background: 'var(--portfolio-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontSize: '3rem',
            fontWeight: '700'
          }}>
            HS
          </span>
        </div>
        <div className="loading-text">
          <h2>Harvinder Singh</h2>
          <p>Full Stack Developer</p>
        </div>
        <div className="loading-progress">
          <div className="loading-bar">
            <div 
              className="loading-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loading-percentage">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}