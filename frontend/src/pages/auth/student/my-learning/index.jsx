import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context/AuthContext";
import { fetchStudentBoughtCoursesService } from "@/services";
import { ArrowLeft } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

function formatPrice(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue === 0) return "Free";
  return `$${numericValue.toFixed(2)}`;
}

export default function MyLearningPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const svgRef = useRef(null);
  const headSectionRef = useRef(null);

  const addSvgRef = (el) => {
    if (el) svgRef.current = el;
  };

  const studentId = useMemo(
    () => currentUser?._id || currentUser?.id || "",
    [currentUser],
  );

  useEffect(() => {
    let active = true;

    async function fetchMyCourses() {
      if (!studentId) {
        if (!active) return;
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetchStudentBoughtCoursesService(studentId);
        if (!active) return;

        const list = response?.data || response?.courses || [];
        setCourses(Array.isArray(list) ? list : []);
      } catch (fetchError) {
        if (!active) return;
        setError(
          fetchError?.response?.data?.message ||
            "Ops! You didn't add any Courses.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMyCourses();

    return () => {
      active = false;
    };
  }, [studentId]);

  useEffect(() => {
    const svgElement = svgRef.current;
    const headElement = headSectionRef.current;
    if (!svgElement || !headElement) return;

    let animationId;
    let baseX = 0;
    let baseY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const setBasePosition = () => {
      const rect = svgElement.getBoundingClientRect();
      const parentRect = headElement.getBoundingClientRect();
      baseX = rect.left - parentRect.left + rect.width / 2;
      baseY = rect.top - parentRect.top + rect.height / 2;
    };

    setBasePosition();

    const repulsionStrength = 40;
    const repulsionRadius = 180;
    const smoothness = 0.15;

    const handleMouseMove = (event) => {
      const rect = headElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const dx = baseX - mouseX;
      const dy = baseY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repulsionRadius) {
        const force = (repulsionRadius - distance) / repulsionRadius;
        const angle = Math.atan2(dy, dx);
        targetX = Math.cos(angle) * force * repulsionStrength;
        targetY = Math.sin(angle) * force * repulsionStrength;
        return;
      }

      targetX = 0;
      targetY = 0;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * smoothness;
      currentY += (targetY - currentY) * smoothness;
      svgElement.style.transform = `translate(${currentX}px, ${currentY}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    headElement.addEventListener("mousemove", handleMouseMove);
    headElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", setBasePosition);

    return () => {
      cancelAnimationFrame(animationId);
      headElement.removeEventListener("mousemove", handleMouseMove);
      headElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", setBasePosition);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {showAnnouncement && (
        <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden bg-[#184EF0]/90 text-sm font-bold text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="inline-flex h-8 w-8 items-center justify-center text-white transition hover:bg-white hover:text-[#184EF0]"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="tracking-wider">
              3 new courses added this week! Explore now →
            </span>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-white transition hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="relative left-1/2 right-1/2 mb-6 h-[250px] w-screen -translate-x-1/2 overflow-hidden bg-white sm:-left-11.5 sm:right-auto sm:top-[-2.25rem] sm:h-[480px] sm:w-screen sm:translate-x-0">
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
            }}
          >
            <img
              src="/learning.png"
              alt="My learning banner"
              className="h-full w-full object-cover blur-[2px]"
            />
            <div className="absolute inset-0 bg-slate-500/20 backdrop-blur-[1px]" />
          </div>
        </div>

        <div
          ref={headSectionRef}
          className="relative mb-8 -mt-5 overflow-hidden border border-slate-200 bg-[#fafdffe3] p-5 shadow-sm sm:p-6"
        >
          <svg
            ref={addSvgRef}
            className="pointer-events-none absolute -left-[105px] -top-[92px] z-0 h-[180px] w-[180px] transition-transform duration-100 ease-out sm:-left-[140px] sm:-top-[108px] sm:h-[220px] sm:w-[220px]"
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
          <svg
            ref={addSvgRef}
            className="pointer-events-none absolute -right-[72px] top-[44px] z-0 h-[160px] w-[160px] transition-transform duration-100 ease-out sm:right-0 sm:top-[20px] sm:h-[220px] sm:w-[220px]"
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

          <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.2em] text-[#184EF0]">
            Student Space
          </p>
          <h1 className="relative z-10 mt-2 text-3xl font-bold tracking-tight text-slate-900">
            My Learning
          </h1>
          <p className="relative z-10 mt-1 text-sm text-slate-600">
            Continue your purchased courses and keep progressing.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading your courses...
          </div>
        ) : error ? (
          <div className="rounded-sm border border-red-200 bg-blue-0 p-6 text-sm text-red-700">
            <p>{error}</p>
            <div className="mt-4 max-w-[220px]">
              <AnimatedButton
                onClick={() => navigate("/dashboard")}
                primaryText="Explore Courses"
                secondaryText="Buy Courses"
                secondaryTextColor="#ffffff"
                fullWidth
              />
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              You have not purchased any courses yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start with a course from the dashboard and it will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-5 inline-flex rounded-md bg-[#184EF0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123fd0]"
            >
              Go To Dashboard
            </button>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const courseId = course?._id || course?.id;
              const title = course?.title || `Course ${index + 1}`;
              const instructorName =
                course?.instructor?.name || course?.instructorName || "Instructor";
              const image =
                course?.image?.url || course?.image || "/course-placeholder.png";
              const price = formatPrice(course?.pricing);

              return (
                <article
                  key={courseId || `${title}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <img src={image} alt={title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{instructorName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#184EF0]">{price}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/course-details/${courseId}`)}
                        className="rounded-md bg-[#184EF0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#123fd0]"
                        disabled={!courseId}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}