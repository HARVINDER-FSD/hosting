import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Menu, Moon, Sun, X, Download, Github, Linkedin, Mail } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollPosition / documentHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
      setActiveSection(sectionId);
    }
  };

const handleResumeDownload = () => {
  const link = document.createElement("a");
  link.href = "/web-developer.pdf"; // correct file path with encoded space
  link.download = "Harvinder_Singh_Resume.pdf"; // this will be the filename when downloaded
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Enhanced Logo */}
          <div className="nav-brand" onClick={() => scrollToSection('home')}>
            <div className="brand-logo">
              <span className="brand-initial">H</span>
              <span className="brand-initial">S</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">Harvinder</span>
              <span className="brand-title">Full Stack Developer</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-center">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href="#" 
                    onClick={() => scrollToSection(item.id)}
                    className={activeSection === item.id ? 'active' : ''}
                  >
                    <span>{item.label}</span>
                    <div className="nav-link-indicator"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="nav-actions">
            <div className="nav-social">
              <a href="https://github.com/harvinder-FSD" target="_blank" rel="noopener noreferrer" className="nav-social-link">
                <Github className="w-4 h-4" />
              </a>
              <a href="hs8339952@gmail.com" className="nav-social-link">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <button className="nav-cta-btn" onClick={handleResumeDownload}>
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </button>
            
            <button className="theme-toggle-advanced" onClick={toggleTheme}>
              <div className="theme-toggle-track">
                <div className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : ''}`}>
                  {theme === "light" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                </div>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="scroll-progress">
          <div 
            className="scroll-progress-bar"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <div className="mobile-brand">
              <div className="brand-logo">
                <span className="brand-initial">H</span>
                <span className="brand-initial">S</span>
              </div>
              <div className="brand-text">
                <span className="brand-name">Harvinder Singh</span>
                <span className="brand-title">Full Stack Developer</span>
              </div>
            </div>
          </div>

          <nav className="mobile-nav-menu">
            {navItems.map((item, index) => (
              <a 
                key={item.id}
                href="#" 
                onClick={() => scrollToSection(item.id)}
                className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mobile-nav-number">0{index + 1}</span>
                <span className="mobile-nav-text">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mobile-nav-footer">
            <div className="mobile-nav-actions">
              <button className="mobile-cta-btn" onClick={handleResumeDownload}>
                <Download className="w-5 h-5" />
                Download Resume
              </button>
              
              <div className="mobile-social">
                <a href="https://github.com/harvinder-FSD" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:hs8339952@gmail.com" className="mobile-social-link">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="mobile-theme-toggle">
              <span>Theme</span>
              <button className="theme-toggle-advanced mobile" onClick={toggleTheme}>
                <div className="theme-toggle-track">
                  <div className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : ''}`}>
                    {theme === "light" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
