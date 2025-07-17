import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Monitor, Server, Database, Settings } from "lucide-react";
import { SkillProgressBar } from "./SkillProgressBar";

export function Skills() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: skill1Ref, isVisible: skill1Visible } = useScrollAnimation();
  const { ref: skill2Ref, isVisible: skill2Visible } = useScrollAnimation();
  const { ref: skill3Ref, isVisible: skill3Visible } = useScrollAnimation();
  const { ref: skill4Ref, isVisible: skill4Visible } = useScrollAnimation();

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Monitor className="w-6 h-6" />,
      skills: ["React.js", , "JavaScript (ES6+)", , "HTML5", "CSS3", "Responsive Design"],
      progressSkills: [
        { name: "React.js", percentage: 90 },
        { name: "JavaScript", percentage: 85 },
        { name: "Bootstrap", percentage: 80 },
        { name: "CSS3", percentage: 90 },
        { name: "HTML5", percentage: 90 }
      ],
      ref: skill1Ref,
      isVisible: skill1Visible
    },
    {
      title: "Backend Development", 
      icon: <Server className="w-6 h-6" />,
      skills: ["Node.js", "Express.js", ],
      progressSkills: [
        { name: "Node.js", percentage: 85 },
        { name: "Express.js", percentage: 80 },
  
        
      ],
      ref: skill2Ref,
      isVisible: skill2Visible
    },
    {
      title: "Database & Cloud",
      icon: <Database className="w-6 h-6" />,
      skills: ["MongoDB", "PostgreSQL", "MySQL",  "Firebase",],
      progressSkills: [
        { name: "MongoDB", percentage: 80 },
        { name: "Firebase", percentage: 90 }
      ],
      ref: skill3Ref,
      isVisible: skill3Visible
    },
   
  ];

  return (
    <section id="skills" className="section" style={{ background: 'var(--portfolio-surface)' }}>
      <div className="container">
        <div 
          ref={headerRef}
          className={`section-header animate-on-scroll ${headerVisible ? 'animate' : ''}`}
        >
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            A comprehensive overview of my technical expertise and the tools I use to bring ideas to life
          </p>
        </div>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              ref={category.ref}
              className={`skill-category animate-on-scroll ${category.isVisible ? 'animate' : ''}`}
            >
              <h3>
                {category.icon}
                {category.title}
              </h3>
              <div className="skill-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-tag">
                    {skill}
                  </div>
                ))}
              </div>
              
              {/* Progress Bars for Key Skills */}
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ 
                  marginBottom: '1rem', 
                  color: 'var(--portfolio-text-secondary)',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Proficiency Levels
                </h4>
                {category.progressSkills.map((skill, skillIndex) => (
                  <SkillProgressBar 
                    key={skillIndex} 
                    skill={skill.name} 
                    percentage={skill.percentage}
                    delay={skillIndex * 200}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
