import { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const svgRefs = useRef([]);
  const sectionRef = useRef(null);
  const testimonialsContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // SVG mouse interaction effect
  useEffect(() => {
    const svgElements = svgRefs.current;
    const sectionElement = sectionRef.current;

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

    svgData.forEach((data, index) => {
      if (data.element) {
        const rect = data.element.getBoundingClientRect();
        const parentRect = sectionElement.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
        data.currentX = 0;
        data.currentY = 0;
        data.targetX = 0;
        data.targetY = 0;
      }
    });

    const handleScroll = () => {
      const el = testimonialsContainerRef.current;
      if (!el) return;

      el.style.setProperty("--fade-left", el.scrollLeft === 0 ? "0%" : "8%");
    };

    const repulsionStrength = 50;
    const repulsionRadius = 200;
    const smoothness = 0.15;

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

    return () => {
      cancelAnimationFrame(animationId);
      sectionElement.removeEventListener("mousemove", handleMouseMove);
      sectionElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Navigation handlers
  const nextTestimonial = () => {
    if (testimonialsContainerRef.current) {
      const container = testimonialsContainerRef.current;
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
    }
  };

  const prevTestimonial = () => {
    if (testimonialsContainerRef.current) {
      const container = testimonialsContainerRef.current;
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  const testimonials = [
    {
      id: 1,
      text: "I wanted to place a review since their support helped me within a day or so, which is nice! Thanks and 5 stars!",
      name: "Oliver Beddows",
      role: "Designer, Manchester",
      rating: 5,
      title: "Great quality!",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      text: "ThemeMove deserves 5 star for theme's features, design quality, flexibility, and support service!",
      name: "Madley Pondor",
      role: "Reporter, San Diego",
      rating: 5,
      title: "Code Quality",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      text: "Very good and fast support during the week. They know what you need, exactly when you need it.",
      name: "Mina Hollace",
      role: "Reporter, London",
      rating: 5,
      title: "Customer Support",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 4,
      text: "Excellent platform for online learning. The interface is intuitive and easy to navigate.",
      name: "Alex Johnson",
      role: "Teacher, New York",
      rating: 5,
      title: "Easy to Use",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 5,
      text: "The course quality is outstanding. Highly recommended for anyone looking to learn online.",
      name: "Sarah Miller",
      role: "Developer, Austin",
      rating: 5,
      title: "Outstanding Quality",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="p-5 max-w-7xl mx-auto w-full">
          {/* Testimonials Section */}
          <section
            ref={sectionRef}
            className="relative w-screen bg1-grid bg-[#184EF0]/70 py-0 px-6 -ml-5 sm:-ml-8.5 overflow-hidden"
          >
            {/* Decorative Wavy Circles - Hidden on mobile */}
            <svg
              ref={addSvgRef}
              className="absolute left-70 top-80 pointer-events-none transition-transform duration-100 ease-out hidden lg:block"
              width="220"
              height="220"
              viewBox="0 0 420 420"
              style={{ willChange: "transform" }}
            >
              <defs>
                <pattern
                  id="wavePatternBlue"
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
              <circle cx="210" cy="210" r="150" fill="url(#wavePatternBlue)" />
            </svg>

            <svg
              ref={addSvgRef}
              className="absolute -right-0 bottom-0 pointer-events-none transition-transform duration-100 ease-out hidden lg:block"
              width="200"
              height="200"
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
                    strokeWidth="1"
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
              className="absolute left-5 bottom-75 pointer-events-none transition-transform duration-100 ease-out hidden lg:block"
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

            {/* Content - Split Layout */}
            <div className="relative z-10 max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 items-start">
                {/* Left Side - Header */}
                <div className="lg:w-2/5 text-white mt-10 lg:mt-30 px-4 lg:px-6 py-4 lg:py-2">
                  <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-3 lg:mb-4 text-center lg:text-left -mt-7">
                    What People Say About Edu
                    <span className="text-[#F97316]">Nest</span>
                  </h2>
                  <p className="text-white/90 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed text-center lg:text-left">
                    One-stop solution for any eLearning center, online courses.
                    People love EduMall because they can create their sites with
                    ease here.
                  </p>
                  {/* Navigation Dots - Centered on mobile */}
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={prevTestimonial}
                      disabled={currentIndex === 0}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <div className="flex gap-1.5">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (testimonialsContainerRef.current) {
                              const container =
                                testimonialsContainerRef.current;
                              const scrollAmount =
                                container.offsetWidth * index;
                              container.scrollTo({
                                left: scrollAmount,
                                behavior: "smooth",
                              });
                              setCurrentIndex(index);
                            }
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            currentIndex === index
                              ? "bg-white w-4 lg:w-6"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextTestimonial}
                      disabled={currentIndex === testimonials.length - 1}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
                {/* Right Side - Scrollable Testimonials */}
                <div className="lg:w-3/5 mt-4 lg:mt-20 lg:-ml-10 w-full">
                  <div
                    ref={testimonialsContainerRef}
                    className="flex gap-3 lg:gap-4 -mt-10 sm:-mt-15 overflow-x-auto scrollbar-hide px-4 lg:px-14 py-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex-none mb-7 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] snap-center"
                      >
                        <div className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10 transition-all duration-300 h-full rounded-md shadow-lg shadow-gray-600">
                          {/* Title */}
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#373737] -mt-2 lg:-mt-5 -mb-4 lg:-mb-8">
                            {testimonial.title}
                          </h3>
                          {/* Testimonial Text */}
                          <p className="text-gray-600 mb-4 lg:mb-9 mt-6 lg:mt-12 text-sm sm:text-base leading-relaxed">
                            {testimonial.text}
                          </p>
                          {/* Author Info with Image */}
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-[#F97316] text-xs lg:text-sm">
                                {testimonial.name}
                              </p>
                              <p className="text-gray-500 text-xs lg:text-sm">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        /* Gradient fade effect on edges - ultra smooth */
        .scrollbar-hide {
          --fade-left: 2%;
          --fade-right: 98%;

          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black var(--fade-left),
            black var(--fade-right),
            transparent 100%
          );
        }
        
        @media (max-width: 768px) {
          .scrollbar-hide {
            --fade-left: 4%;
            --fade-right: 96%;
          }
        }
        
        /* Add a subtle glow to the cards */
        .snap-center > div:hover {
          box-shadow:
            0 8px 30px -4px rgba(0, 0, 0, 0.15),
            0 4px 20px -4px rgba(24, 78, 240, 0.2);
          transform: translateY(-2px);
        }
        
        /* Mobile touch improvements */
        @media (max-width: 640px) {
          .snap-center > div:active {
            transform: scale(0.98);
            transition: transform 0.2s;
          }
        }
      `}</style>
    </div>
  );
}
