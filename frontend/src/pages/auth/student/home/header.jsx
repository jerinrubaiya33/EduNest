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

    svgData.forEach((data) => {
      if (data.element) {
        const rect = data.element.getBoundingClientRect();
        const parentRect = headElement.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
        data.currentX = 0;
        data.currentY = 0;
        data.targetX = 0;
        data.targetY = 0;
      }
    });

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
      className="relative .font-caveat3 overflow-visible w-screen -ml-15 bg-white px-5 pt-8 pb-6 lg:px-0 lg:pt-0 lg:pb-4"
    >
      {/* Top Left Moving SVG */}
      <svg
        ref={addSvgRef}
        className="hidden  sm:block absolute -left-25 bg-white -top-32 pointer-events-none transition-transform duration-100 ease-out z-10"
        width="220"
        height="220"
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

      {/* Bottom Right SVG */}
      <svg
        ref={addSvgRef}
        className="hidden sm:block absolute right-42 -bottom-22 pointer-events-none transition-transform duration-100 ease-out z-10"
        width="220"
        height="220"
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

      <div className="relative z-20 ml-15">
        <h2 className="text-sm font-caveat3 lg:text-[1rem] font-medium text-[#1877d9] tracking-wider -mt-6 lg:mt-10 mb-3 lg:mb-4 ml-1">
          {t("hero_tagline")}
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 ">
          <div className="flex-1 lg:-mb-16">
            <h1 className="text-[1.6rem] sm:text-4xl lg:text-[2.7rem] font-medium text-[#2D3436] font-caveat lg:-mt-20 relative font-caveat3">
              {t("hero_title_learn")}{" "}
              <span className="text-[#1877d9] font-caveat3">{t("hero_title_practice")}</span>{" "}
              <span className="relative inline-block">
                {t("hero_title_master")}

                <svg
                  className="absolute -bottom-2 lg:-bottom-3 left-30 lg:left-37 w-[160px] lg:w-[240px] h-[14px] lg:h-[24px]"
                  viewBox="0 0 280 24"
                  fill="none"
                >
                  <path
                    d="M0,12 C40,4 90,20 140,12 C190,4 240,20 280,12"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="text-base lg:text-lg
                         font-medium
                         text-gray-700
                         max-w-3xl
                         leading-[1.75]
                         tracking-wide
                         mt-4"
            >
              {t("hero_description")}
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 w-full max-w-xl"
            >
              <div className="group relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="h-12 w-full rounded-sm border border-[#D8E6FF] bg-[#EDF4FF] px-4 pr-12 text-sm tracking-wide text-[#184EF0] placeholder:text-[#184EF0] placeholder:opacity-90 outline-none transition focus:border-[#184EF0] focus:shadow-[-3px_-0.2px_0px_#184EF0]"
                />

                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#184EF0] transition group-hover:scale-110"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center relative -mt-15 sm:-mt-20 ">
            {/* Image 1 - Left */}
            <div className="relative -rotate-3 z-30 -mt-2 -ml-5 sm:ml-0 mr-0 max-lg:scale-90 max-lg:mt-20">
              <img
                src="/img1.png"
                alt="Study illustration"
                style={{
                  width: "348px",
                  height: "400px",
                  backgroundColor: "#FBA060",
                  objectFit: "cover",
                  borderRadius: "2px",
                  boxShadow:
                    "0 28px 60px rgba(15, 23, 42, 0.16), 0 14px 30px rgba(15, 23, 42, 0.1)",
                }}
                draggable={false}
              />
            </div>

            {/* Image 2 - Middle (wider, shorter, overlapping) */}
            <div
              className="relative mt-11 z-40 -mb-44 -mx-6 -ml-1 sm:-ml-5 -mr-42 sm:-mr-46 max-lg:scale-100"
              style={{ marginTop: "100px" }}
            >
              <img
                src="/img2.png"
                alt="Study illustration"
                style={{
                  width: "290px",
                  height: "200px",
                  backgroundColor: "#fde68a",
                  objectFit: "cover",
                  borderRadius: "2px",
                  boxShadow:
                    "0 28px 60px rgba(15, 23, 42, 0.16), 0 14px 30px rgba(15, 23, 42, 0.1)",
                }}
                draggable={false}
              />
            </div>

            {/* Image 3 - Right */}
            <div className="relative z-30 rotate-3 -ml-10 mr-10 mb-24 max-lg:scale-100 max-lg:mt-20 -mt-18">
              <img
                src="/img3.png"
                alt="Study illustration"
                style={{
                  width: "250px",
                  height: "280px",
                  objectFit: "cover",
                  borderRadius: "2px",
                  boxShadow:
                    "0 28px 60px rgba(15, 23, 42, 0.16), 0 14px 30px rgba(15, 23, 42, 0.1)",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
