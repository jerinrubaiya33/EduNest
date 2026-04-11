export default function TopPick({ course, categoryLabel = "Course" }) {
  if (!course) {
    return (
      <div className="relative left-1/2 right-1/2 mt-0 -mx-[51vw] w-screen bg-[#fdfdfd]">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <h3 className="text-[1.75rem] font-bold text-[#2D3436]">Our top pick for you</h3>
          <div className="mt-4 rounded-sm bg-grid p-4">
            <p className="text-sm text-gray-600">
              We are preparing personalized recommendations for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const price = typeof course.pricing === "number" ? course.pricing : 0;
  const discountedPrice = price === 0 ? 0 : Math.max(1, Math.round(price * 0.6));

  return (
    <section className="relative left-1/2 right-1/2 mt-9 -mx-[51vw] w-screen bg-[#fcfcfc]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h3 className="relative ml-10 mb-7 inline-block text-[1.75rem] font-bold text-[#2D3436]">
          Our Top Pick For You
          <svg
            className="absolute -bottom-3 left-13 "
            width="260"
            height="20"
            viewBox="0 0 260 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,10 C45,0 90,20 130,10 C170,0 215,20 260,10"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </h3>

        <div className="rounded-sm bg-grid p-4 sm:p-5">
          <div className="mx-auto mt-5 mb-5 max-w-[980px] rounded-sm bg-white p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="h-[190px] w-full overflow-hidden rounded-sm bg-gray-100 sm:h-[240px]">
                  <img
                    src={course.image?.url || "/course-placeholder.png"}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <h4 className="text-xl font-bold leading-tight text-[#1d2748] sm:text-2xl">
                  {course.title}
                </h4>

                <p className="mt-2 text-base text-[#2D3436]">
                  {course.subtitle || "Master practical skills with guided lessons and projects."}
                </p>

                <p className="mt-2 text-base text-[#1d2748]">
                  By {course.instructor?.name || "Course Instructor"}
                </p>

                <div className="mt-2 text-sm text-gray-600">
                  Updated <span className="font-semibold text-green-700">February 2026</span>
                  <span className="mx-2">•</span>
                  <span>{course.curriculum?.length || 20} total lectures</span>
                  <span className="mx-2">•</span>
                  <span>{course.level || "All levels"}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="font-bold text-[#7f3f00]">4.5 ★★★★☆</span>
                  <span className="rounded-sm bg-[#5a2ecf] px-3 py-1 text-xs font-semibold text-white">
                    Premium
                  </span>
                  <span className="rounded-sm bg-[#c7ecee] px-3 py-1 text-xs font-semibold text-[#0a4f63]">
                    Bestseller
                  </span>
                  <span className="rounded-sm bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#184EF0]">
                    {categoryLabel}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-3xl font-extrabold text-[#1d2748]">
                    {price === 0 ? "Free" : `$${discountedPrice}`}
                  </span>
                  {price > 0 && (
                    <span className="text-xl text-gray-500 line-through">${price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
