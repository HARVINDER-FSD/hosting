import { useState, useEffect } from "react";

interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
}

export function TypingAnimation({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50, 
  delay = 2000 
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const fullText = texts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delay]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span>
      {currentText}
      <span style={{ 
        opacity: showCursor ? 1 : 0, 
        color: 'var(--portfolio-primary)',
        fontWeight: 'normal'
      }}>
        |
      </span>
    </span>
  );
}