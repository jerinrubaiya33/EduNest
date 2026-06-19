import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../../../../components/ui/AnimatedButton";

export default function FindHelp() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const svgRefs = useRef([]);

  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  useEffect(() => {
    const canUseHoverEffects =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseHoverEffects || prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    const svgElements = svgRefs.current;

    if (!sectionEl || svgElements.length === 0) return;

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

    const calculateBasePositions = () => {
      const parentRect = sectionEl.getBoundingClientRect();

      svgData.forEach((data) => {
        if (!data.element) return;

        const rect = data.element.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
      });
    };

    calculateBasePositions();

    const repulsionStrength = 40;
    const repulsionRadius = 180;
    const smoothness = 0.12;

    const handleMouseMove = (e) => {
      const rect = sectionEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      svgData.forEach((data) => {
        if (!data.element) return;

        const dx = data.baseX - mouseX;
        const dy = data.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(dy, dx);

          data.targetX = Math.cos(angle) * force * repulsionStrength;
          data.targetY = Math.sin(angle) * force * repulsionStrength;
        } else {
          data.targetX = 0;
          data.targetY = 0;
        }
      });
    };

    const handleMouseLeave = () => {
      svgData.forEach((data) => {
        data.targetX = 0;
        data.targetY = 0;
      });
    };

    const animate = () => {
      svgData.forEach((data) => {
        if (!data.element) return;

        data.currentX += (data.targetX - data.currentX) * smoothness;
        data.currentY += (data.targetY - data.currentY) * smoothness;

        data.element.style.transform = `translate(${data.currentX}px, ${data.currentY}px)`;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    sectionEl.addEventListener("mousemove", handleMouseMove);
    sectionEl.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", calculateBasePositions);

    return () => {
      cancelAnimationFrame(animationId);
      sectionEl.removeEventListener("mousemove", handleMouseMove);
      sectionEl.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", calculateBasePositions);
    };
  }, []);

  return (
  <section ref={sectionRef} className="px-3 md:px-0 py-10 md:py-14 mb-14 mt-14 bg-white">
	    <div className="max-w-3xl md:max-w-4xl mx-auto">
	      {/* White Card */}
	      <div className="relative overflow-hidden flex flex-col gap-5 rounded-none border border-[#184EF0]/10 bg-gradient-to-br from-[#f5f9ff] via-white to-[#f3f3f3] px-5 py-6 md:py-18 -mt-2 md:flex-row md:items-center md:justify-between md:px-10">

        {/* Text */}
        <div className="relative z-10 text-center md:text-left">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[#184EF0]">
            Let Us Help
          </p>

          <h3 className="mt-2 text-xl md:text-3xl font-bold text-[#2D3436]">
            Finding Right Courses
          </h3>
        </div>

        {/* Button */}
        <div className="relative z-10 w-full md:w-fit flex justify-center md:justify-start">
          <AnimatedButton
            onClick={() => navigate("/dashboard")}
            size="lg"
            primaryText="Let's find"
            secondaryText="Courses"
            showArrow
          />
        </div>

        {/* Decorative SVG 1 */}
        <svg
          ref={addSvgRef}
          className="absolute -right-20 md:-right-20 bottom-0 md:bottom-6 pointer-events-none rotate-[-12deg] opacity-90 md:opacity-90 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
          viewBox="0 0 420 420"
          style={{ willChange: "transform" }}
        >
          <defs>
            <pattern
              id="wavePatternWhite"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 9 C4 0 14 18 18 9"
                stroke="#184EF0"
                strokeWidth="0.7"
                fill="none"
                opacity="1"
              />
            </pattern>
          </defs>

          <circle cx="210" cy="210" r="150" fill="url(#wavePatternWhite)" />
        </svg>

        {/* Decorative SVG 2 */}
        <svg
          ref={addSvgRef}
          className="absolute -left-18 md:left-auto md:right-160 -bottom-16 md:-bottom-22 pointer-events-none rotate-[-12deg] opacity-90 md:opacity-90 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
          viewBox="0 0 420 420"
          style={{ willChange: "transform" }}
        >
          <defs>
            <pattern
              id="wavePatternWhite2"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 9 C4 0 14 18 18 9"
                stroke="#184EF0"
                strokeWidth="0.7"
                fill="none"
                opacity="1"
              />
            </pattern>
          </defs>

          <circle cx="210" cy="210" r="150" fill="url(#wavePatternWhite2)" />
        </svg>
      </div>
    </div>
  </section>
);
}
