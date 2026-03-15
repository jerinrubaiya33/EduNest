import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef(null);
  const svgRefs = useRef([]);

  useEffect(() => {
    const footerElement = footerRef.current;
    const svgElements = svgRefs.current.filter(Boolean);

    if (!footerElement || svgElements.length === 0) return;

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
      const parentRect = footerElement.getBoundingClientRect();

      svgData.forEach((data) => {
        if (!data.element) return;

        const rect = data.element.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
      });
    };

    initializeBasePositions();

    const repulsionStrength = 30;
    const repulsionRadius = 220;
    const smoothness = 0.14;

    const handleMouseMove = (e) => {
      const rect = footerElement.getBoundingClientRect();
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
    footerElement.addEventListener("mousemove", handleMouseMove);
    footerElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", initializeBasePositions);

    return () => {
      cancelAnimationFrame(animationId);
      footerElement.removeEventListener("mousemove", handleMouseMove);
      footerElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", initializeBasePositions);
    };
  }, []);

  const quickLinks = [
    { label: "Browse Courses", href: "/courses" },
    { label: "My Learning", href: "/my-learning" },
    { label: "Pricing", href: "/pricing" },
    { label: "Teach on EduNest", href: "/teach" },
  ];

  const resources = [
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Careers", href: "/careers" },
  ];

  return (
    <footer ref={footerRef} className="relative bg-white  text-[#184EF0] overflow-hidden">
      {/* Decorative waves */}
      <svg
        ref={(el) => {
          svgRefs.current[0] = el;
        }}
        className="absolute -right-15 -top-20 opacity-30 w-[220px] h-[220px] md:w-[280px] md:h-[280px]"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="footerWaveOrange"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 9 C4 0 14 18 18 9"
              stroke="#184EF0"
              strokeWidth="1"
              fill="none"
              opacity="1"
            />
          </pattern>
        </defs>
        <circle cx="210" cy="210" r="150" fill="url(#footerWaveOrange)" />
      </svg>
      <svg
        ref={(el) => {
          svgRefs.current[1] = el;
        }}
        className="absolute -left-16 bottom-10 opacity-30 w-[200px] h-[200px] md:w-[240px] md:h-[240px]"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="footerWaveWhite"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 9 C4 0 14 18 18 9"
              stroke="#184EF0"
              strokeWidth="1"
              fill="none"
              opacity="1"
            />
          </pattern>
        </defs>
        <circle cx="210" cy="210" r="150" fill="url(#footerWaveWhite)" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold font-caveat">
              Edu<span className="text-[#F97316]">Nest</span>
            </h3>
            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              Build skills for the future with expert-led courses, practical
              projects, and a learning experience crafted for momentum.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <button
                  key={index}
                  className="h-9 w-9 rounded-full bg-[#184EF0]/10 hover:bg-[#F97316] transition-colors flex items-center justify-center text-[#184EF0] hover:text-white"
                  aria-label="social"
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#F97316] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#F97316] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F97316]" />
                221B Baker Street, London
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F97316]" />
                +1 (800) 555-0148
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F97316]" />
                support@edunest.com
              </p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 rounded-full bg-[#184EF0]/10 px-4 py-2">
                <input
                  type="email"
                  placeholder="Get product updates"
                  className="w-full bg-transparent text-sm placeholder:text-gray-600 outline-none"
                />
                <button
                  type="button"
                  className="rounded-full bg-[#F97316] px-3 py-1 text-xs font-semibold text-white"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#184EF0]/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#184EF0]/70">
          <p>© {new Date().getFullYear()} EduNest. All rights reserved.</p>
          <div className="mt-3 sm:mt-0 flex items-center gap-4">
            <a href="/privacy" className="hover:text-[#F97316]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#F97316]">
              Terms
            </a>
            <a href="/accessibility" className="hover:text-[#F97316]">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
