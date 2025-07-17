import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Download, MapPin, GraduationCap, Code } from "lucide-react";

export function About() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

  const handleResumeDownload = async () => {
    try {
      const response = await fetch('/api/resume/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Harvinder_Singh_Resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  return (
    <section id="about" className="section">
      <div className="container">
        <div 
          ref={headerRef}
          className={`section-header animate-on-scroll ${headerVisible ? 'animate' : ''}`}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A dedicated full-stack developer with a passion for creating robust, scalable, and user-friendly applications
          </p>
        </div>
        <div className="contact-container">
          <div 
            ref={leftRef}
            className={`animate-on-scroll ${leftVisible ? 'animate' : ''}`}
          >
            <h3>Professional Summary</h3>
            <p style={{ color: 'var(--portfolio-text-secondary)', marginBottom: '2rem', lineHeight: '1.7' }}>
              As a fresh graduate with strong fundamentals in full-stack development, I bring enthusiasm and modern development practices to every project. 
              My experience spans across frontend frameworks like React , backend technologies including Node.js,Express.js.
            </p>
            <div className="skill-list" style={{ marginBottom: '2rem' }}>
              <div className="skill-tag">Problem Solving</div>
              <div className="skill-tag">Team Collaboration</div>
              <div className="skill-tag">Agile Development</div>
              <div className="skill-tag">Version Control</div>
            </div>
            <button className="btn btn-primary" onClick={handleResumeDownload}>
              <Download className="w-5 h-5" />
              Download Resume
            </button>
          </div>
          <div 
            ref={rightRef}
            className={`animate-on-scroll ${rightVisible ? 'animate' : ''}`}
          >
            <div className="contact-item">
              <div className="contact-icon">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4>Location</h4>
                <p style={{ color: 'var(--portfolio-text-secondary)' }}>A-52 Hariom Nagar Part-4 D-cabin Sabarmati Ahmedabad</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4>Education</h4>
                <p style={{ color: 'var(--portfolio-text-secondary)' }}>B.sc(physics)
                   pursuing from Bhavan's Seth R.A Collage of Science Shahpur Ahmedabad
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4>Experience Level</h4>
                <p style={{ color: 'var(--portfolio-text-secondary)' }}>Fresh Graduate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
