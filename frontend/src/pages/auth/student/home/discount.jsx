import AnimatedButton from "@/components/ui/AnimatedButton";
import { useNavigate } from "react-router-dom";

export default function Discount() {
  const navigate = useNavigate();
  const cards = [
    {
      id: "student-deal",
      eyebrow: "Limited Offer",
      title: "Save Big On\nPremium Courses",
      description:
        "Claim student-friendly pricing on top-rated programs and keep learning without stretching your budget.",
      buttonLabel: "Get Discount",
      background: "bg-[#f2f0ee]",
      accent: "bg-[#ffe8d6]",
      patternTone: "from-[#ffd7b5]/70 via-[#fff4ea] to-[#dce8ff]/70",
      blobFill: "#ffd5b8",
      blobShadow: "drop-shadow(0 14px 24px rgba(245, 158, 11, 0.16))",
      gridClass: "border-[#f1b47b]/60",
      waveClass: "stroke-[#f59e0b]/70",
    },
    {
      id: "bundle-deal",
      eyebrow: "For Teams",
      title: "Bundle Learning\nFor Your Group",
      description:
        "Unlock extra savings when friends or classmates enroll together in practical, career-focused tracks.",
      buttonLabel: "View Bundles",
      background: "bg-[#f8eded]",
      accent: "bg-[#e9f1ff]",
      patternTone: "from-[#ffdfe3]/80 via-[#fff7f8] to-[#d8e7ff]/75",
      blobFill: "#d9e5ff",
      blobShadow: "drop-shadow(0 14px 24px rgba(124, 156, 245, 0.16))",
      gridClass: "border-[#d5b2ba]/55",
      waveClass: "stroke-[#7c9cf5]/60",
    },
  ];

  return (
    <section className="relative mt-8 left-1/2 right-1/2 -mx-[51vw] w-screen bg-[#ffffff] pt-100 ">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`group relative min-h-[420px] overflow-hidden rounded-[6px] ${card.background} px-8 pt-8 pb-36 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[430px] sm:px-10 sm:pt-5 sm:pb-26 -mt-100`}
            >
              <div
                className={`mb-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#1d2748] ${card.accent}`}
              >
                {card.eyebrow}
              </div>

              <h2 className="whitespace-pre-line text-[2rem] font-semibold leading-[1.15] text-[#1d2748] sm:text-[2rem]">
                {card.title}
              </h2>

              <p className="mt-5 max-w-[320px] text-[1rem] leading-7 text-[#334155]">
                {card.description}
              </p>

              <div className="mt-6">
                <AnimatedButton
                  onClick={() => navigate("/coming-soon")}
                  size="lg"
                  primaryText={card.buttonLabel}
                  secondaryText="Start Saving"
                  showArrow
                  className="shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:translate-x-2 group-hover:scale-[1.03]">
                  <div
                    className={`absolute -right-8 bottom-[-58px] h-[190px] w-[78%] rounded-tl-[130px] rounded-tr-[18px] bg-gradient-to-br ${card.patternTone} sm:w-[72%]`}
                  />
                  <svg
                    className="absolute right-[17%] bottom-[84px] z-20 h-[92px] w-[98px] rotate-[-8deg]"
                    viewBox="0 0 98 92"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: card.blobShadow }}
                    aria-hidden="true"
                  >
                    <ellipse cx="49" cy="46" rx="34" ry="30" fill={card.blobFill} />
                  </svg>
                  <svg
                    className="absolute right-[8%] bottom-[18px] z-10 h-[112px] w-[118px] rotate-[7deg]"
                    viewBox="0 0 118 112"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: card.blobShadow, opacity: 0.96 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M67.43 6.38C82.11 10.72 99.39 14.9 107.57 27.91C116.15 41.55 115.57 61.11 108.02 75.34C100.2 90.09 84.04 102.96 67.43 105.73C50.1 108.62 32.49 101.39 20.01 89.03C7.82 76.96 0.61 59.21 3.88 42.22C7.18 25.12 21.31 12.16 37.54 6.87C47.13 3.74 57.47 3.43 67.43 6.38Z"
                      fill={card.blobFill}
                    />
                  </svg>
                  <div
                    className={`absolute right-[6%] bottom-[24px] z-30 h-[112px] w-[128px] rounded-[18px] border bg-white/35 backdrop-blur-[1px] ${card.gridClass}`}
                  >
                    <div className="grid h-full grid-cols-4 grid-rows-4">
                      {Array.from({ length: 16 }).map((_, cellIndex) => (
                        <span
                          key={cellIndex}
                          className={`border ${card.gridClass}`}
                        />
                      ))}
                    </div>
                  </div>
                  <svg
                    className="absolute left-8 bottom-7 h-[76px] w-[190px] opacity-70"
                    viewBox="0 0 190 76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 57C20 37 38 37 56 57C74 77 92 77 110 57C128 37 146 37 164 57C172 66 178 68 188 64"
                      className={card.waveClass}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 29C20 9 38 9 56 29C74 49 92 49 110 29C128 9 146 9 164 29C172 38 178 40 188 36"
                      className={card.waveClass}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
