import { useEffect, useRef, useState } from "react";
import { Mail, Search, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const sectionRef = useRef(null);
  const svgRefs = useRef([]);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const svgElements = svgRefs.current.filter(Boolean);

    if (!sectionElement || svgElements.length === 0) return;

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

    const initializeBasePositions = () => {
      const parentRect = sectionElement.getBoundingClientRect();
      svgData.forEach((data) => {
        if (!data.element) return;
        const rect = data.element.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
      });
    };

    initializeBasePositions();

    const repulsionStrength = 24;
    const repulsionRadius = 180;
    const smoothness = 0.12;

    const handleMouseMove = (e) => {
      const rect = sectionElement.getBoundingClientRect();
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
    sectionElement.addEventListener("mousemove", handleMouseMove);
    sectionElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", initializeBasePositions);

    return () => {
      cancelAnimationFrame(animationId);
      sectionElement.removeEventListener("mousemove", handleMouseMove);
      sectionElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", initializeBasePositions);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <section className="px-3 py-14 -mt-30">
      <div className="max-w-5xl mx-auto">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-md border border-[#184EF0]/20 bg-white px-4 py-10 md:px-6 md:py-14"
        >
          <svg
            ref={(el) => {
              svgRefs.current[0] = el;
            }}
            className="absolute top-0 -right-18 opacity-30 pointer-events-none"
            width="200"
            height="200"
            viewBox="0 0 420 420"
            aria-hidden="true"
          >
            <defs>
              <pattern id="newsletterWaveTop" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M0 9 C4 0 14 18 18 9" stroke="#184EF0" strokeWidth="1.2" fill="none" />
              </pattern>
            </defs>
            <circle cx="210" cy="210" r="150" fill="url(#newsletterWaveTop)" />
          </svg>

          <svg
            ref={(el) => {
              svgRefs.current[1] = el;
            }}
            className="absolute bottom-24 left-85 opacity-30 pointer-events-none"
            width="220"
            height="220"
            viewBox="0 0 420 420"
            aria-hidden="true"
          >
            <defs>
              <pattern id="newsletterWaveBottom" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M0 9 C4 0 14 18 18 9" stroke="#184EF0" strokeWidth="1.4" fill="none" />
              </pattern>
            </defs>
            <circle cx="210" cy="210" r="150" fill="url(#newsletterWaveBottom)" />
          </svg>

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between -right-9">
            <div className="text-[#2D3436]">
              <h3 className="text-3xl font-bold ">Join Our Newsletter</h3>
              <p className="mt-2 max-w-xl text-sm uppercase tracking-[0.1em] text-gray-600">
                Get courses updates, learning tips, & 
                <br/>
                exclusive offers straight to your inbox.
              </p> 
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="relative right-7">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F97316]">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-14 w-full rounded-md border border-[#fecfae]  pl-10 pr-32 text-sm text-gray-800 outline-none placeholder:text-gray-500 focus:border-[#F97316]"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center justify-center gap-2 rounded-md bg-[#F97316] px-4 text-sm font-semibold text-white transition hover:bg-[#e8660f]"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
