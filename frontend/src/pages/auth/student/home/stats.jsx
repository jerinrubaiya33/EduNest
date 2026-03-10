import { useEffect, useState, useRef } from "react";
import {
  Brain,
  GraduationCap,
} from "lucide-react";

export default function Stats() {
  const svgRefs = useRef([]);
  const statsSectionRef = useRef(null);

  // SVG mouse interaction effect for multiple SVGs
  useEffect(() => {
    const svgElements = svgRefs.current;
    const statsElement = statsSectionRef.current;

    if (!statsElement || svgElements.length === 0) return;

    let animationId;
    const svgData = svgElements.map((svg) => ({
      element: svg,
      baseX: 0,
      baseY: 0,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    }));

    // Initialize base positions
    svgData.forEach((data, index) => {
      if (data.element) {
        const rect = data.element.getBoundingClientRect();
        const parentRect = statsElement.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
        data.currentX = 0;
        data.currentY = 0;
        data.targetX = 0;
        data.targetY = 0;
      }
    });

    // Repulsion strength and radius
    const repulsionStrength = 50; // How far the SVG moves away from cursor
    const repulsionRadius = 200; // Distance at which effect is maximum
    const smoothness = 0.15; // Lower = smoother, slower movement

    const handleMouseMove = (e) => {
      const rect = statsElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      svgData.forEach((data) => {
        if (!data.element) return;

        // Calculate distance between mouse and SVG center
        const dx = data.baseX - mouseX;
        const dy = data.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
          // Calculate repulsion force (stronger when closer)
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(dy, dx);

          // Calculate target position (move away from mouse)
          data.targetX = Math.cos(angle) * force * repulsionStrength;
          data.targetY = Math.sin(angle) * force * repulsionStrength;
        } else {
          // Return to center when mouse is far
          data.targetX = 0;
          data.targetY = 0;
        }
      });
    };

    const handleMouseLeave = () => {
      // Return to center when mouse leaves section
      svgData.forEach((data) => {
        data.targetX = 0;
        data.targetY = 0;
      });
    };

    // Smooth animation loop
    const animate = () => {
      svgData.forEach((data) => {
        if (!data.element) return;

        // Smooth interpolation
        data.currentX += (data.targetX - data.currentX) * smoothness;
        data.currentY += (data.targetY - data.currentY) * smoothness;

        // Apply transform
        data.element.style.transform = `translate(${data.currentX}px, ${data.currentY}px)`;
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Add event listeners
    statsElement.addEventListener("mousemove", handleMouseMove);
    statsElement.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      statsElement.removeEventListener("mousemove", handleMouseMove);
      statsElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Function to add ref to array
  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen  -mt-16 flex flex-col">
      <main className="flex-1">
        <div className="p-5 max-w-6xl mx-auto w-full">
          {/* Stats Section */}
          <section
            ref={statsSectionRef}
            className="relative w-screen bg1-grid bg-[#184EF0]/70  py-6 -mt-36 -ml-20 overflow-hidden"
          >
            {/* Decorative Wavy Circles - Now all interactive */}
            <svg
              ref={addSvgRef}
              className="absolute left-270 top-1/2 mt-10 -translate-y-1/2 pointer-events-none  rotate-[-12deg]  transition-transform duration-100 ease-out"
              width="250"
              height="250"
              viewBox="0 0 420 420"
              style={{ willChange: "transform" }}
            >
              <defs>
                <pattern
                  id="wavePatternOrange"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 9 C4 0 14 18 18 9"
                    stroke="#ffffff"
                    strokeWidth="0.7"
                    fill="none"
                    opacity="1"
                  />
                </pattern>
              </defs>
              <circle
                cx="210"
                cy="210"
                r="150"
                fill="url(#wavePatternOrange)"
              />
            </svg>
            <svg
              ref={addSvgRef}
              className="absolute left-0 top-1/2 mt-30 -translate-y-1/2 pointer-events-none  transition-transform duration-100 ease-out"
              width="250"
              height="250"
              viewBox="0 0 420 420"
              style={{ willChange: "transform" }}
            >
              <defs>
                <pattern
                  id="wavePatternOrange"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 9 C4 0 14 18 18 9"
                    stroke="#F97316"
                    strokeWidth="2.2"
                    fill="none"
                    opacity="1"
                  />
                </pattern>
              </defs>
              <circle
                cx="210"
                cy="210"
                r="150"
                fill="url(#wavePatternOrange)"
              />
            </svg>

            {/* ===== Content ===== */}
            <div className="relative z-10 max-w-5xl mx-auto px-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center text-white">
                {/* Stat 1 */}
                <div
                  className="group backdrop-blur-md px-6 py-5 text-center rounded
                  shadow-lg hover:shadow-lg transition-all duration-300
                  hover:-translate-y-1 "
                >
                  <h3 className="flex justify-center items-center gap-2 text-[1.60rem] font-extrabold mr-5  ">
                    <Brain className="w-11 h-9 text-[#F97316]" />
                    1500+
                  </h3>
                  <p className="mt-2 font-bold text-base font-caveat">Expert-Led Courses</p>
                  <p className="mt-2 text-ls max-w-xs mx-auto">
                    Learn from industry professionals with real-world
                    experience.
                  </p>
                  <div className="mt-6 h-0.5 w-12 bg-[#F97316] mx-auto group-hover:w-20 transition-all" />
                </div>

                {/* Stat 2 */}
                <div
                  className="group backdrop-blur-md px-6 py-4 text-center rounded
                 shadow-lg hover:shadow-lg transition-all duration-300
                 hover:-translate-y-1"
                >
                  <h3 className="flex justify-center items-center gap-2 text-[1.60rem] font-extrabold mr-5 -mb-1  ">
                    <GraduationCap className="w-12 h-11 text-[#F97316]" />
                    99%
                  </h3>
                  <p className="mt-3 font-bold text-base font-caveat">
                    Student Satisfaction
                  </p>
                  <p className="mt-2 text-md max-w-xs mx-auto">
                    Rated highly by learners only for exceptional quality and
                    clarity.
                  </p>
                  <div className="mt-6 h-0.5 w-12 bg-[#F97316] mx-auto group-hover:w-20 transition-all" />
                </div>

                {/* Stat 3 */}
                <div
                  className="group bg-white/10 rounded backdrop-blur-md  px-6 py-5 text-center shadow-lg hover:shadow-lg transition-all duration-300
                  hover:-translate-y-1"
                >
                  <h3 className="text-[1.60rem] font-extrabold ">Lifetime</h3>
                  <p className="mt-2 font-bold text-base font-caveat">Access</p>
                  <p className="mt-2 max-w-xs mx-auto text-md">
                    Choose from hundreds of courses and learn at your own pace.
                  </p>
                  <div className="mt-6 h-0.5 w-12 bg-white mx-auto group-hover:w-20 transition-all" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}