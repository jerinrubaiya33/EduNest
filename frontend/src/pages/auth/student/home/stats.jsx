// import { useEffect, useRef, useState } from "react";
// import { Brain, GraduationCap } from "lucide-react";

// export default function Stats() {
//   const svgRefs = useRef([]);
//   const statsSectionRef = useRef(null);
//   const [isRevealActive, setIsRevealActive] = useState(false);

//   // SVG mouse interaction effect for multiple SVGs
//   useEffect(() => {
//     const svgElements = svgRefs.current;
//     const statsElement = statsSectionRef.current;

//     if (!statsElement || svgElements.length === 0) return;

//     let animationId;
//     const svgData = svgElements.map((svg) => ({
//       element: svg,
//       baseX: 0,
//       baseY: 0,
//       currentX: 0,
//       currentY: 0,
//       targetX: 0,
//       targetY: 0,
//     }));

//     svgData.forEach((data) => {
//       if (data.element) {
//         const rect = data.element.getBoundingClientRect();
//         const parentRect = statsElement.getBoundingClientRect();
//         data.baseX = rect.left - parentRect.left + rect.width / 2;
//         data.baseY = rect.top - parentRect.top + rect.height / 2;
//       }
//     });

//     const repulsionStrength = 50;
//     const repulsionRadius = 200;
//     const smoothness = 0.15;

//     const handleMouseMove = (e) => {
//       const rect = statsElement.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;

//       svgData.forEach((data) => {
//         if (!data.element) return;

//         const dx = data.baseX - mouseX;
//         const dy = data.baseY - mouseY;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < repulsionRadius) {
//           const force = (repulsionRadius - distance) / repulsionRadius;
//           const angle = Math.atan2(dy, dx);

//           data.targetX = Math.cos(angle) * force * repulsionStrength;
//           data.targetY = Math.sin(angle) * force * repulsionStrength;
//         } else {
//           data.targetX = 0;
//           data.targetY = 0;
//         }
//       });
//     };

//     const handleMouseLeave = () => {
//       svgData.forEach((data) => {
//         data.targetX = 0;
//         data.targetY = 0;
//       });
//     };

//     const animate = () => {
//       svgData.forEach((data) => {
//         if (!data.element) return;

//         data.currentX += (data.targetX - data.currentX) * smoothness;
//         data.currentY += (data.targetY - data.currentY) * smoothness;
//         data.element.style.transform = `translate(${data.currentX}px, ${data.currentY}px)`;
//       });

//       animationId = requestAnimationFrame(animate);
//     };

//     animate();

//     statsElement.addEventListener("mousemove", handleMouseMove);
//     statsElement.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       cancelAnimationFrame(animationId);
//       statsElement.removeEventListener("mousemove", handleMouseMove);
//       statsElement.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   useEffect(() => {
//     const statsElement = statsSectionRef.current;
//     if (!statsElement) return;

//     let ticking = false;

//     const updateRevealState = () => {
//       const rect = statsElement.getBoundingClientRect();
//       const viewportHeight = window.innerHeight;
//       const topTrigger = viewportHeight * 0.7;
//       const bottomTrigger = viewportHeight * 0.3;
//       const shouldReveal =
//         rect.top <= topTrigger && rect.bottom >= bottomTrigger;

//       setIsRevealActive(shouldReveal);
//       ticking = false;
//     };

//     const handleScroll = () => {
//       if (ticking) return;

//       ticking = true;
//       requestAnimationFrame(updateRevealState);
//     };

//     updateRevealState();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", updateRevealState);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", updateRevealState);
//     };
//   }, []);

//   const addSvgRef = (el) => {
//     if (el && !svgRefs.current.includes(el)) {
//       svgRefs.current.push(el);
//     }
//   };

//   const getRevealClass = (delay = "delay-0") =>
//     isRevealActive
//       ? `translate-y-0 opacity-100 blur-0 ${delay}`
//       : `translate-y-10 opacity-35 blur-[1px] ${delay}`;

//   return (
//     <div className="min-h-screen -mt-16 flex flex-col">
//       <main className="flex-1">
//         <div className="p-5 max-w-6xl mx-auto w-full">
//           <section
//             ref={statsSectionRef}
//             className="relative w-screen bg1-grid bg-[#184EF0]/70 py-6 mb-90 -mt-30 sm:-mt-30 sm:-ml-20 -ml-10 overflow-hidden"
//           >
//             <svg
//               ref={addSvgRef}
//               className="absolute left-270 top-1/2 mt-10 -translate-y-1/2 pointer-events-none rotate-[-12deg] transition-transform duration-100 ease-out"
//               width="250"
//               height="250"
//               viewBox="0 0 420 420"
//               style={{ willChange: "transform" }}
//             >
//               <defs>
//                 <pattern
//                   id="wavePatternOrange"
//                   width="18"
//                   height="18"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <path
//                     d="M0 9 C4 0 14 18 18 9"
//                     stroke="#ffffff"
//                     strokeWidth="1"
//                     fill="none"
//                     opacity="1"
//                   />
//                 </pattern>
//               </defs>
//               <circle
//                 cx="210"
//                 cy="210"
//                 r="150"
//                 fill="url(#wavePatternOrange)"
//               />
//             </svg>

//             <svg
//               ref={addSvgRef}
//               className="absolute left-0 top-1/2 mt-30 -translate-y-1/2 pointer-events-none transition-transform duration-100 ease-out"
//               width="250"
//               height="250"
//               viewBox="0 0 420 420"
//               style={{ willChange: "transform" }}
//             >
//               <defs>
//                 <pattern
//                   id="wavePatternOrangeSecondary"
//                   width="18"
//                   height="18"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <path
//                     d="M0 9 C4 0 14 18 18 9"
//                     stroke="#ffffff"
//                     strokeWidth="1"
//                     fill="none"
//                     opacity="1"
//                   />
//                 </pattern>
//               </defs>
//               <circle
//                 cx="210"
//                 cy="210"
//                 r="150"
//                 fill="url(#wavePatternOrangeSecondary)"
//               />
//             </svg>

//             <div className="relative z-10 max-w-5xl mx-auto px-5">
//               <div className="grid grid-cols-1 gap-8 text-center text-white sm:grid-cols-2 lg:grid-cols-3">
//                 <div className="group rounded px-9 py-3 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6 sm:py-6">
//                   <h3
//                     className={`flex justify-center items-center gap-1.5 text-[1.45rem] font-extrabold mr-3 transition-all duration-700 ease-out sm:text-[1.95rem] sm:mr-5 ${getRevealClass()}`}
//                   >
//                     <Brain className="h-7 w-8 text-[#F97316] sm:h-9 sm:w-11" />
//                     1500+
//                   </h3>
//                   <p
//                     className={`mt-1.5 font-caveat text-base font-bold transition-all duration-700 ease-out sm:mt-2 sm:text-[1.1rem] ${getRevealClass("delay-100")}`}
//                   >
//                     Expert-Led Courses
//                   </p>
//                   <p
//                     className={`mt-1.5 mx-auto max-w-xs text-base transition-all duration-700 ease-out sm:mt-2 sm:text-ls ${getRevealClass("delay-200")}`}
//                   >
//                     Learn from industry professionals.
//                   </p>
//                   <div
//                     className={`mt-4 mx-auto h-[2px] w-7 bg-[#F97316] transition-all duration-700 ease-out group-hover:w-20 sm:mt-6 sm:w-10 sm:group-hover:w-24 ${getRevealClass("delay-300")}`}
//                   />
//                 </div>

//                 <div className="group rounded px-9 py-3 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6 sm:py-6">
//                   <h3
//                     className={`flex justify-center items-center gap-1.5 text-[1.45rem] font-extrabold mr-3 transition-all duration-700 ease-out sm:text-[1.95rem] sm:mr-5 ${getRevealClass()}`}
//                   >
//                     <GraduationCap className="h-7 w-8 text-[#F97316] sm:h-10  sm:w-11" />
//                      99%
//                   </h3>
//                   <p
//                     className={`mt-1.5 font-caveat text-base font-bold transition-all duration-700 ease-out sm:mt-2 sm:text-[1.1rem] ${getRevealClass("delay-100")}`}
//                   >
//                     Student Satisfaction
//                   </p>
//                   <p
//                     className={`mt-1.5 mx-auto max-w-xs text-base transition-all duration-700 ease-out sm:mt-2 sm:text-ls ${getRevealClass("delay-200")}`}
//                   >
//                    Rated for quality & clarity.
//                   </p>
//                  <div
//                     className={`mt-4 mx-auto h-[2px] w-7 bg-[#F97316] transition-all duration-700 ease-out group-hover:w-20 sm:mt-6 sm:w-10 sm:group-hover:w-24 ${getRevealClass("delay-300")}`}
//                   />
//                 </div>

//                 <div className="group bg-white/10 rounded px-9 py-3 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6 sm:py-6">
//                   <h3
//                     className={`flex justify-center items-center gap-1.5 text-[1.45rem] font-extrabold mr-3 transition-all duration-700 ease-out sm:text-[1.95rem] sm:mr-5 ${getRevealClass()}`}
//                   >
                    
//                      Lifetime
//                   </h3>
//                   <p
//                     className={`mt-1.5 font-caveat text-base font-bold transition-all duration-700 ease-out sm:mt-2 sm:text-[1.1rem] ${getRevealClass("delay-100")}`}
//                   >
//                     Access
//                   </p>
//                   <p
//                     className={`mt-1.5 mx-auto max-w-xs text-base transition-all duration-700 ease-out sm:mt-2 sm:text-ls ${getRevealClass("delay-200")}`}
//                   >
//                    Learn anytime, at your pace
//                   </p>
//                   <div
//                     className={`mt-4 mx-auto h-[2px] w-7 bg-[#ffffff] transition-all duration-700 ease-out group-hover:w-20 sm:mt-6 sm:w-10 sm:group-hover:w-24 ${getRevealClass("delay-300")}`}
//                   />
//                 </div>

          
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }







import {
  BrainCircuit,
  BadgeCheck,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const statsItems = [
 {
  icon: BrainCircuit,
  title: "Build Your",
  subtitle: "Core Knowledge",
},
{
  icon: BadgeCheck,
  title: "Gain Recognized",
  subtitle: "Certifications",
},
{
  icon: BriefcaseBusiness,
  title: "Prepare for Your",
  subtitle: "Dream Career",
},
{
  icon: Sparkles,
  title: "Explore and Excel",
  subtitle: "Across Fields",
},
];

export default function Stats() {
  return (
    <section className="relative mb-120 mt-22 ml-43 sm:ml-124 right-1/2 -mx-[50vw] w-screen bg-[#1877d9] ">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 text-white sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {statsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.subtitle}
                className="flex items-center gap-4 border-white/15 sm:border-r-0 lg:border-r lg:pr-6 last:border-r-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center ">
                  <Icon className="h-9 w-9 stroke-[1.5]" />
                </div>

                <div>
                  <p className="text-[0.98rem] font-medium leading-tight">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.98rem] font-medium leading-tight">
                    {item.subtitle}
                  </p>
                  <div className="mt-2 h-px w-12 bg-white/35 sm:hidden" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
