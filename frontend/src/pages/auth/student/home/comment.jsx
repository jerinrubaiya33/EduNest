import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Ignore mobile URL-bar resizes so the vh-based section doesn't jump on refresh.
ScrollTrigger.config({ ignoreMobileResize: true });

const testimonials = [
  {
    id: 1,
    text: "I wanted to place a review since their support helped me within a day or so, which is nice! Thanks and 5 stars!",
    name: "Oliver Beddows",
    role: "Designer, Manchester",
    title: "Great quality!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    id: 2,
    text: "ThemeMove deserves 5 star for theme's features, design quality, flexibility, and support service!",
    name: "Madley Pondor",
    role: "Reporter, San Diego",
    title: "Code Quality",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
  },
  {
    id: 3,
    text: "Very good and fast support during the week. They know what you need, exactly when you need it.",
    name: "Mina Hollace",
    role: "Reporter, London",
    title: "Customer Support",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  {
    id: 4,
    text: "Excellent platform for online learning. The interface is intuitive and easy to navigate.",
    name: "Alex Johnson",
    role: "Teacher, New York",
    title: "Easy to Use",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

const CARD_OFFSET = -24;
const CARD_ROTATE = 2;

// Scroll choreography. All values are timeline units where 1 unit === 100vh
// of scrolling (the wrapper is TOTAL * 100vh tall and the trigger spans it).
const HOLD = 0.6; // brief pause before the stack starts moving
const SETTLE = 0.6; // card eases from the stack into the front slot
const FLY = 1.2; // front card glides out through the top
const TAIL = 0.5; // final card rests before the section unsticks

// card 0 starts in the front slot, so it only flies; every later card settles
// (overlapping the previous card's exit) and then flies itself.
const ANIM_END =
  testimonials.length > 1
    ? HOLD + (testimonials.length - 1) * FLY
    : HOLD + SETTLE;
const TOTAL = ANIM_END + TAIL;

export default function Testimonials() {
  const wrapperRef = useRef(null);
  const boxRef = useRef(null);
  const cardsRef = useRef([]);
  const floatRefs = useRef([]);
  const hoverRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () =>
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const nextTestimonial = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - 1));

  const handleSvgHover = (index, toProps) => {
    const el = hoverRefs.current[index];
    if (el) gsap.to(el, { duration: 0.5, ease: "power2.out", ...toProps });
  };

  const handleSvgLeave = (index, fromProps) => {
    const el = hoverRefs.current[index];
    if (el) gsap.to(el, { duration: 0.6, ease: "power2.inOut", ...fromProps });
  };

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!wrapper || cards.length === 0) return;

    // Measure how far each card must travel to clear the top of the box
    // (cards are untransformed at this point, so this is their resting state).
    const box = boxRef.current;
    const travels = box
      ? cards.map(
          (card) =>
            card.getBoundingClientRect().bottom -
            box.getBoundingClientRect().top +
            24,
        )
      : cards.map(() => window.innerHeight * 1.2);

    const ctx = gsap.context(() => {
      // Decorative SVG float. Paused while the section is off-screen so the
      // three infinite tweens don't keep ticking for the rest of the page.
      const floats = floatRefs.current
        .filter(Boolean)
        .map((el, i) =>
          gsap.to(el, {
            y: "+=18",
            x: i % 2 === 0 ? "+=10" : "-=10",
            rotation: i % 2 === 0 ? 5 : -5,
            duration: 2.5 + i * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
            willChange: "transform",
          }),
        );

      const visibility = ScrollTrigger.create({
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) =>
          floats.forEach((t) => (self.isActive ? t.play() : t.pause())),
      });
      if (visibility.isActive) floats.forEach((t) => t.play());

      // Keep every card on its own compositing layer so scaling/rotating text
      // and box-shadows is handed to the GPU instead of repainting per frame.
      gsap.set(cards, {
        y: (i) => i * CARD_OFFSET,
        rotate: (i) => (i % 2 === 0 ? i * CARD_ROTATE : -i * CARD_ROTATE),
        scale: (i) => 1 - i * 0.04,
        transformOrigin: "50% 100%",
        force3D: true,
        willChange: "transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%", // mobile better trigger
          // one timeline unit === 100vh: motion finishes exactly as the
          // sticky box reaches the end of its wrapper (no dead scroll)
          end: () => "+=" + wrapper.offsetHeight,
          scrub: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to({}, { duration: HOLD });

      cards.forEach((card, i) => {
        const flyStart = HOLD + i * FLY;

        if (i === 0) {
          if (cards.length === 1) {
            // single card: it never leaves - keep the timeline slot anyway
            tl.to(
              card,
              { rotate: 0, scale: 1, y: 0, duration: SETTLE, ease: "power1.inOut" },
              flyStart,
            );
          } else {
            // card 0 already sits in the front slot - just glide it out
            tl.to(
              card,
              {
                y: -travels[i],
                duration: FLY,
                ease: "power1.inOut",
                force3D: true,
              },
              flyStart,
            );
          }
          return;
        }

        // The settle overlaps the tail of the previous card's exit and ends
        // exactly when that card is gone, so there is never a stretch where
        // nothing on screen is moving, and every hand-off starts and ends at
        // zero velocity (no lurching between phases).
        tl.to(
          card,
          {
            rotate: 0,
            scale: 1,
            y: 0,
            duration: SETTLE,
            ease: "power1.inOut",
            force3D: true,
          },
          flyStart - SETTLE,
        );

        if (i !== cards.length - 1) {
          tl.to(
            card,
            {
              y: -travels[i],
              duration: FLY,
              ease: "power1.inOut",
              force3D: true,
            },
            flyStart,
          );
        }
      });

      tl.to({}, { duration: TAIL });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${TOTAL * 100}vh` }}
    >
      {/* MOBILE FIX ONLY HERE - mobile box spans 4vh..97vh so it covers the
          viewport bottom like desktop (22vh..97vh) and no white band shows
          below the blue box while the section is pinned */}
      <div
        ref={boxRef}
        className="sticky top-[4vh] lg:top-[22vh] h-[93vh] lg:h-[75vh] -mt-10 lg:mt-0 mb-40 lg:mb-30  bg-[#f4f1eb] px-6
         lg:px-10 overflow-hidden"
      >
        {/* SVGs */}
        <div
          ref={(el) => {
            floatRefs.current[0] = el;
          }}
          className="absolute left-70 -top-20 hidden lg:block"
          style={{ willChange: "transform" }}
        >
          <div
            ref={(el) => {
              hoverRefs.current[0] = el;
            }}
            onMouseEnter={() =>
              handleSvgHover(0, { x: 40, y: -30, rotation: 15 })
            }
            onMouseLeave={() => handleSvgLeave(0, { x: 0, y: 0, rotation: 0 })}
            className="pointer-events-auto cursor-pointer transition-none"
          >
            <svg width="220" height="220" viewBox="0 0 420 420">
              <defs>
                <pattern
                  id="wavePatternBlue"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 9 C4 0 14 18 18 9"
                    stroke="#228BE6"
                    strokeWidth="0.7"
                    fill="none"
                    opacity="1"
                  />
                </pattern>
              </defs>
              <circle cx="210" cy="210" r="150" fill="url(#wavePatternBlue)" />
            </svg>
          </div>
        </div>
        <div
          ref={(el) => {
            floatRefs.current[1] = el;
          }}
          className="absolute right-10 bottom-0 hidden lg:block"
          style={{ willChange: "transform" }}
        >
          <div
            ref={(el) => {
              hoverRefs.current[1] = el;
            }}
            onMouseEnter={() =>
              handleSvgHover(1, { x: -35, y: -25, rotation: -12 })
            }
            onMouseLeave={() => handleSvgLeave(1, { x: 0, y: 0, rotation: 0 })}
            className="pointer-events-auto cursor-pointer transition-none"
          >
            <svg width="200" height="200" viewBox="0 0 420 420">
              <defs>
                <pattern
                  id="wavePatternOrange"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 9 C4 0 14 18 18 9"
                    stroke="#228BE6"
                    strokeWidth="1"
                    fill="none"
                    opacity="1"
                  />
                </pattern>
              </defs>
              <circle cx="210" cy="210" r="150" fill="url(#wavePatternOrange)" />
            </svg>
          </div>
        </div>
        <div
          ref={(el) => {
            floatRefs.current[2] = el;
          }}
          className="absolute left-5 -bottom-30 hidden lg:block"
          style={{ willChange: "transform" }}
        >
          <div
            ref={(el) => {
              hoverRefs.current[2] = el;
            }}
            onMouseEnter={() =>
              handleSvgHover(2, { x: 20, y: -20, rotation: 10 })
            }
            onMouseLeave={() => handleSvgLeave(2, { x: 0, y: 0, rotation: 0 })}
            className="pointer-events-auto cursor-pointer transition-none"
          >
            <svg width="250" height="250" viewBox="0 0 420 420">
              <defs>
                <pattern
                  id="wavePatternOrange2"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 9 C4 0 14 18 18 9"
                    stroke="#228BE6"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.8"
                  />
                </pattern>
              </defs>
              <circle
                cx="210"
                cy="210"
                r="150"
                fill="url(#wavePatternOrange2)"
              />
            </svg>
          </div>
        </div>

        <div className="mx-auto max-w-6xl h-full flex flex-col justify-center">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            {/* LEFT */}
            <div className="lg:w-2/5 text-black mt-50 lg:mt-20 px-4 lg:px-6 py-4 lg:py-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-center lg:text-left">
                What People Say About Edu
                <span className="text-[#228BE6]">Nest</span>
              </h2>

              <p className="text-black/90 text-sm lg:text-base mb-4 lg:mb-6 text-center lg:text-left">
                One-stop solution for any eLearning center, online courses.
                People love EduMall because they can create their sites with
                ease here.
              </p>

              {/* <div className="flex items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={prevTestimonial}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-full bg-white/20"
                >
                  <ChevronLeft />
                </button>

                <div className="flex gap-1.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full ${currentIndex === index ? "bg-white w-6" : "bg-white/50"
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  disabled={currentIndex === testimonials.length - 1}
                  className="p-1.5 rounded-full bg-white/20"
                >
                  <ChevronRight />
                </button>
              </div> */}
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-3/5">
              <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[380px]">
                {[...testimonials].reverse().map((t, reversedIndex) => {
                  const index = testimonials.length - 1 - reversedIndex;

                  return (
                    <article
                      key={t.id}
                      ref={(el) => {
                        cardsRef.current[index] = el;
                      }}
                      className={`absolute left-0 top-0 w-full flex justify-center lg:block ${index === 1 ? "translate-x-[8px] sm:translate-x-0" : ""
                        }`}
                    >
                      <div
                        className="
                        rounded-[8px] 
                        mt-4 lg:mt-27 
                        bg-white 
                        border border-orange-400 
                        
                        px-4 py-3 
                        sm:px-5 sm:py-4 
                        lg:px-6 lg:py-5 
                        
                        shadow-lg 
                        
                        max-w-[92%] sm:max-w-[85%] 
                        lg:max-w-full
                      "
                      >
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                          {t.title}
                        </h3>

                        <p className="mb-2 sm:mb-3 text-sm sm:text-base text-gray-700">
                          {t.text}
                        </p>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-[#e8660f] text-sm sm:text-base">
                              {t.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}