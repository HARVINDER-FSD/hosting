// import { useState, useEffect } from "react";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// interface StatItemProps {
//   end: number;
//   label: string;
//   suffix?: string;
//   duration?: number;
// }

// function StatItem({ end, label, suffix = "", duration = 2000 }: StatItemProps) {
//   const [count, setCount] = useState(0);
//   const { ref, isVisible } = useScrollAnimation();

//   useEffect(() => {
//     if (isVisible) {
//       let startTime: number;
//       const startCount = 0;
      
//       const animate = (currentTime: number) => {
//         if (!startTime) startTime = currentTime;
//         const progress = Math.min((currentTime - startTime) / duration, 1);
        
//         setCount(Math.floor(progress * (end - startCount) + startCount));
        
//         if (progress < 1) {
//           requestAnimationFrame(animate);
//         }
//       };
      
//       requestAnimationFrame(animate);
//     }
//   }, [isVisible, end, duration]);

//   return (
//     <div ref={ref} className="stat-item">
//       <div className="stat-number">
//         {count}{suffix}
//       </div>
//       <div className="stat-label">{label}</div>
//     </div>
//   );
// }

// export function StatsCounter() {
//   const stats = [
//     { end: 15, label: "Projects Completed", suffix: "+" },
//     { end: 100, label: "Code Commits", suffix: "+" },
//     { end: 95, label: "Client Satisfaction", suffix: "%" },
//     { end: 24, label: "Support Hours", suffix: "/7" }
//   ];

//   return (
//     <section className="stats-section">
//       <div className="container">
//         <div className="stats-grid">
//           {stats.map((stat, index) => (
//             <StatItem
//               key={index}
//               end={stat.end}
//               label={stat.label}
//               suffix={stat.suffix}
//               duration={2000 + index * 200}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }