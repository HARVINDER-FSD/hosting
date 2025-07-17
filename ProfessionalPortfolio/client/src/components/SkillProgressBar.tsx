import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SkillProgressBarProps {
  skill: string;
  percentage: number;
  delay?: number;
}

export function SkillProgressBar({ skill, percentage, delay = 0 }: SkillProgressBarProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const duration = 1500;
        const steps = 60;
        const increment = percentage / steps;
        let current = 0;
        
        const animate = () => {
          current += increment;
          if (current <= percentage) {
            setAnimatedPercentage(Math.min(current, percentage));
            setTimeout(animate, duration / steps);
          } else {
            setAnimatedPercentage(percentage);
          }
        };
        
        animate();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage, delay]);

  return (
    <div ref={ref} className="skill-progress-item">
      <div className="skill-progress-header">
        <span className="skill-name">{skill}</span>
      </div>
      <div className="skill-progress-bar">
        <div 
          className="skill-progress-fill"
          style={{ 
            width: `${animatedPercentage}%`,
            transition: 'width 0.1s ease'
          }}
        />
      </div>
    </div>
  );
}