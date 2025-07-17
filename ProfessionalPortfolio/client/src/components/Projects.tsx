import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import DanceImg from "../../assets/Dance.png";
import EcomImg from "../../assets/Ecom.png"; // Assuming this image exists

import { ExternalLink, Github, Book } from "lucide-react";

export function Projects() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: project1Ref, isVisible: project1Visible } = useScrollAnimation();
  const { ref: project2Ref, isVisible: project2Visible } = useScrollAnimation();
  const { ref: project3Ref, isVisible: project3Visible } = useScrollAnimation();
  const { ref: project4Ref, isVisible: project4Visible } = useScrollAnimation();

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "E-Commerce Platform is a fully functional online shopping website built from scratch using modern front-end technologies. It features product listings, dynamic shopping cart, responsive design, user authentication, and an intuitive checkout experience. This project demonstrates my ability to build scalable, user-centric interfaces with clean code structure and component reuse. Technologies used include HTML, CSS, Bootstrap, and JavaScript.",
      image: EcomImg,
      technologies: ["html", "Css", "Bootstrap", "Java script"],
      links: [
        {
          type: "demo",
          icon: <ExternalLink className="w-4 h-4" />,
          text: "Live Demo",
          href: "https://mye-comerce.netlify.app/",
        },
        {
          type: "github",
          icon: <Github className="w-4 h-4" />,
          text: "GitHub",
          href:
            "https://github.com/HARVINDER-FSD/javascript/tree/main/E-com",
        },
      ],
      ref: project1Ref,
      isVisible: project1Visible,
    },
    {
      title: "Dance Academy",
      description:"Dance Academy is a visually engaging and responsive website built for a modern dance studio. It showcases class schedules, instructor profiles, contact forms, and promotional content — all structured for an intuitive and elegant user experience. Built with HTML, CSS, Bootstrap, and JavaScript, it highlights my skills in layout design, animation, and responsive development. The site combines aesthetics with functionality, reflecting the energy and creativity of the dance world.",
      image: DanceImg,
      technologies: ["Html", "css", "bootstrap", "Java script"],
      links: [
        {
          type: "demo",
          icon: <ExternalLink className="w-4 h-4" />,
          text: "Live Demo",
          href: "https://myradancestudio.netlify.app",
        },
        {
          type: "github",
          icon: <Github className="w-4 h-4" />,
          text: "GitHub",
          href:
            "https://github.com/HARVINDER-FSD/jquery/tree/main/dance",
        },
      ],
      ref: project2Ref,
      isVisible: project2Visible,
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header animate-on-scroll ${
            headerVisible ? "animate" : ""
          }`}
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A showcase of my recent work and personal projects that demonstrate
            my skills and passion for development
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              ref={project.ref}
              className={`project-card animate-on-scroll ${
                project.isVisible ? "animate" : ""
              }`}
            >
              <div
                className="project-image"
                style={{
                  background: project.gradient,
                  padding: "1rem",
                  borderRadius: "10px",
                  height:"223px",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto object-cover rounded-md shadow-md"
                />
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className={`project-link ${
                        link.type === "demo" || link.type === "docs"
                          ? "primary"
                          : "secondary"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
