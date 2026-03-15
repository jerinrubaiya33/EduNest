import { ArrowRight, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Modern Web Development Masterclass",
    dateLabel: "MARCH 5, 2026",
    location: "Online Live Session",
    image: "/study.png",
  },
  {
    id: 2,
    title: "Backend Development and API Architecture Workshop",
    dateLabel: "MARCH 12, 2026",
    location: "EduNest Campus",
    image: "/study2.png",
  },
  {
    id: 3,
    title: "Data Science and Machine Learning Bootcamp",
    dateLabel: "MARCH 18, 2026",
    location: "Hybrid Event",
    image: "/study3.png",
  },
  {
    id: 4,
    title: "Artificial Intelligence and Cloud Computing Summit",
    dateLabel: "MARCH 25, 2026",
    location: "Innovation Hub",
    image: "/study4.png",
  },
];

export default function Events() {
  return (
    <section className="px-5 py-16 -mt-50 sm:-mt-30 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="relative inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#184EF0]">
            Upcoming Events
            <svg
              className="absolute -bottom-3 left-1/2 -translate-x-1/2"
              width="170"
              height="14"
              viewBox="0 0 170 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9C30 3 58 13 86 9C114 5 142 13 168 7"
                stroke="#F97316"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#2D3436] md:text-4xl">
            Explore Events in Education
           
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Where people find all events they may want to be involved in.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="group">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-md bg-[#184EF0] px-3 py-1 text-xs font-bold text-white">
                  {event.dateLabel}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold leading-tight text-[#2D3436] transition-colors group-hover:text-[#184EF0]">
                {event.title}
              </h3>

              <p className="mt-4 flex items-center gap-2 text-md text-gray-500">
                <MapPin className="h-4 w-4 text-[#184EF0]" />
                {event.location}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 mb-15 text-center">
          <p className="text-base text-gray-500">
            Discover workshops, meetups, and conferences curated for learners.
            <button
              type="button"
              className="group relative ml-2 inline-flex items-center gap-1 font-semibold text-[#184EF0] transition"
            >
              View all events
              <ArrowRight className="h-4 w-4" />
              <svg
                className="pointer-events-none absolute -bottom-1 ml-16 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
                width="120"
                height="12"
                viewBox="0 0 120 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C22 3 40 11 60 8C80 5 98 11 118 7"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
