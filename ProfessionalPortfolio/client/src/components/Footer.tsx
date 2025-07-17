import { Heart, Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span style={{ 
                background: 'var(--portfolio-gradient)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Harvinder Singh
              </span>
            </h3>
            <p style={{ 
              color: 'var(--portfolio-text-secondary)',
              marginTop: '1rem',
              maxWidth: '300px'
            }}>
              Full Stack Developer passionate about creating exceptional digital experiences through clean code and innovative solutions.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Get In Touch</h4>
            <div className="footer-contact">
              <a href="mailto:harvinder.singh.dev@gmail.com" className="footer-contact-item">
                <Mail className="w-4 h-4" />
                hs8339952@gmail.com
              </a>
              <a href="tel:+919876543210" className="footer-contact-item">
                <span>📞</span>
                +91 7229014722
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Follow Me</h4>
            <div className="footer-social">
              <a href="https://github.com/harvinder-FSD" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:hs8339952@gmail.com" className="footer-social-link">
                <Mail className="w-5 h-5" />
              </a>
                  <a href="https://www.instagram.com/lts.harvinder.05" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Harvinder Singh. All rights reserved.</p>
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--portfolio-text-secondary)' 
          }}>
            Built with <Heart className="w-4 h-4" style={{ color: 'var(--portfolio-error)' }} /> using modern web technologies
          </p>
          <button 
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
