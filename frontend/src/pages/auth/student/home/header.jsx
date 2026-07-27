import { useLang } from "@/context/lang-context";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Head() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const svgRefs = useRef([]);
  const headSectionRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    sessionStorage.setItem("courseSearchTerm", searchTerm.trim());
    navigate("/dashboard");
  };

  useEffect(() => {
    const svgElements = svgRefs.current;
    const headElement = headSectionRef.current;

    if (!headElement || svgElements.length === 0) return;

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

    const updateBasePositions = () => {
      const parentRect = headElement.getBoundingClientRect();
      svgData.forEach((data) => {
        if (data.element) {
          const rect = data.element.getBoundingClientRect();
          data.baseX = rect.left - parentRect.left + rect.width / 2;
          data.baseY = rect.top - parentRect.top + rect.height / 2;
        }
      });
    };

    updateBasePositions();
    window.addEventListener("resize", updateBasePositions);

    const repulsionStrength = 40;
    const repulsionRadius = 180;
    const smoothness = 0.15;

    const handleMouseMove = (e) => {
      const rect = headElement.getBoundingClientRect();
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

    headElement.addEventListener("mousemove", handleMouseMove);
    headElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateBasePositions);
      headElement.removeEventListener("mousemove", handleMouseMove);
      headElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  return (
    <div
      ref={headSectionRef}
      className="relative w-screen -ml-5 sm:-ml-14.5 overflow-hidden bg-gradient-to-br from-[#fafcff] via-white to-[#e3edfd] px-5 sm:px-8 lg:px-22 pt-25 pb-20 sm:pt-38 sm:pb-26"
    >
      {/* Top Left Decorative Wave SVG */}
      <svg
        ref={addSvgRef}
        className="hidden md:block absolute left-2 top-4 lg:left-0 lg:top-18 pointer-events-none transition-transform duration-100 ease-out z-10 opacity-70 lg:opacity-100"
        width="180"
        height="180"
        viewBox="0 0 420 420"
        style={{ willChange: "transform" }}
      >
        <defs>
          <pattern
            id="wavePatternTopLeft"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 9 C4 0 14 18 18 9"
              stroke="#184EF0"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <circle cx="210" cy="210" r="150" fill="url(#wavePatternTopLeft)" />
      </svg>

      {/* Bottom Right Decorative Wave SVG */}
      <svg
        ref={addSvgRef}
        className="hidden md:block absolute right-8 bottom-4 lg:right-44 lg:bottom-8 pointer-events-none transition-transform duration-100 ease-out z-10 opacity-70 lg:opacity-100"
        width="180"
        height="180"
        viewBox="0 0 420 420"
        style={{ willChange: "transform" }}
      >
        <defs>
          <pattern
            id="wavePatternBottomRight"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 C5 0 15 20 20 10"
              stroke="#184EF0"
              strokeWidth="2.5"
              fill="none"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <circle cx="210" cy="210" r="160" fill="url(#wavePatternBottomRight)" />
      </svg>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Top Tagline */}
        <h2 className="text-xs sm:text-sm lg:text-[1rem] font-medium text-[#1877d9] tracking-wider mb-2 sm:mb-3 text-left">
          {t("hero_tagline")}
        </h2>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
          {/* Left Side Content */}
          <div className="flex-1 w-full text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] lg:leading-[1.25] font-medium text-[#2D3436] relative">
              {t("hero_title_learn")}{" "}
              <span className="text-[#1877d9]">
                {t("hero_title_practice")}
              </span>{" "}
              <span className="relative inline-block">
                {t("hero_title_master")}

                <svg
                  className="absolute -bottom-2 left-0 w-[110px] sm:w-[140px] lg:w-[185px] h-[10px] lg:h-[20px]"
                  viewBox="0 0 280 24"
                  fill="none"
                >
                  <path
                    d="M0,12 C40,4 90,20 140,12 C190,4 240,20 280,12"
                    stroke="#F97316"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 max-w-xl leading-relaxed tracking-wide mt-4 sm:mt-5 text-left">
              {t("hero_description")}
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 sm:mt-8 w-full max-w-xl"
            >
              <div className="group relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="h-12 sm:h-13 w-full rounded-full border border-[#bbd4ff] bg-[#EDF4FF] px-5 pr-12 text-sm tracking-wide text-[#184EF0] placeholder:text-[#184EF0] placeholder:opacity-80 outline-none transition focus:border-[#184EF0] focus:shadow-[-3px_-0.2px_0px_#184EF0]"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#184EF0] transition group-hover:scale-110"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Stacked Image Layout */}
          <div className="w-full lg:w-auto flex items-center justify-center relative mt-4 lg:mt-0 self-center">
            {/* Image 1 - Left */}
            <div className="relative -rotate-3 z-30 shrink-0">
              <img
                src="/img1.png"
                alt="Study illustration"
                className="w-[140px] h-[165px] sm:w-[200px] sm:h-[235px] lg:w-[240px] lg:h-[280px] object-cover rounded-[2px] shadow-[0_15px_30px_rgba(15,23,42,0.12)]"
                draggable={false}
              />
            </div>

            {/* Image 2 - Middle */}
            <div className="relative z-40 -mx-6 sm:-mx-10 lg:-mx-12 mt-8 sm:mt-12 lg:mt-16 shrink-0">
              <img
                src="/img2.png"
                alt="Study illustration"
                className="w-[120px] h-[85px] sm:w-[170px] sm:h-[118px] lg:w-[210px] lg:h-[145px] object-cover rounded-[2px] shadow-[0_15px_30px_rgba(15,23,42,0.12)]"
                draggable={false}
              />
            </div>

            {/* Image 3 - Right */}
            <div className="relative z-30 rotate-3 mt-3 sm:mt-4 shrink-0">
              <img
                src="/img3.png"
                alt="Study illustration"
                className="w-[100px] h-[115px] sm:w-[150px] sm:h-[165px] lg:w-[180px] lg:h-[200px] object-cover rounded-[2px] shadow-[0_15px_30px_rgba(15,23,42,0.12)]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}