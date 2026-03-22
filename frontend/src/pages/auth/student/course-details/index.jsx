//student / course-details / index.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/auth-context/AuthContext";
import { useLang } from "@/context/lang-context";
import { useStudent } from "@/context/student-context";
import { courseCategories } from "@/config";
import { fetchStudentViewCourseDetailsService, searchStudentCoursesService } from "@/services";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CirclePlay,
  Clock3,
  GraduationCap,
  Globe2,
  Lock,
  Search,
  Signal,
  UserRound,
} from "lucide-react";
import styled from "styled-components";
import Footer from "../home/footer";
import AnimatedButton from "@/components/ui/AnimatedButton";

const levelMap = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const StyledSearchBar = styled.div`
  .input-container {
    width: 360px;
    position: relative;
  }

  .icon {
    position: absolute;
    right: 15px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
    cursor: pointer;
    color: #f97316;
  }

  .input {
    width: 100%;
    height: 40px;
    padding: 10px 42px 10px 16px;
    transition: 0.2s linear;
    border: 1px solid #ffecdb;
    font-size: 15px;
    letter-spacing: 0.5px;
    background: #fff7f2;
    border-radius: 3px;
  }

  .input:focus {
    outline: none;
    border: 1.5px solid #fba060;
    box-shadow: -3px -0.2px 0px #fba060;
  }

  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }

  @keyframes anim {
    0%,
    100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }
    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
`;

function formatPrice(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue === 0) return "Free";
  return `$${numericValue.toFixed(2)}`;
}

function formatLevel(level) {
  if (!level) return "All Levels";
  return levelMap[level] || level;
}

function getLectureVideoUrl(lecture) {
  return (
    lecture?.videoUrl ||
    lecture?.video?.url ||
    lecture?.video?.secure_url ||
    lecture?.media?.videoUrl ||
    ""
  );
}

function getLectureDuration(lecture) {
  return (
    lecture?.duration ||
    lecture?.videoDuration ||
    lecture?.video?.duration ||
    lecture?.meta?.duration ||
    ""
  );
}

function formatDuration(value) {
  if (value === null || value === undefined || value === "") return "--:--";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "--:--";
    if (!/^\d+$/.test(trimmed)) return trimmed;
    value = Number(trimmed);
  }

  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";

  const totalSeconds = Math.floor(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildLearningPoints(course) {
  const source =
    course?.objective ||
    course?.detailedDescription ||
    course?.description ||
    "Build practical skills with guided lessons and real projects.";
  return source
    .split(/(?:\r?\n)+|(?<=[.!?])\s+|[;,]/)
    .map((item) =>
      item
        .trim()
        .replace(/^[-*•\d.)\s]+/, "")
        .replace(/[.!?]+$/, "")
        .trim(),
    )
    .filter((item) => item.length > 8)
    .slice(0, 12);
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useLang();
  const {
    cartItems,
    cartCount,
    cartTotal,
    addCourseToCart,
    removeCourseFromCart,
    isCourseInCart,
  } = useStudent();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPrimaryActionDone, setIsPrimaryActionDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchCourses, setSearchCourses] = useState([]);
  const [isSearchingCourses, setIsSearchingCourses] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [previewLecture, setPreviewLecture] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [selectedCheckoutCourseIds, setSelectedCheckoutCourseIds] = useState([]);
  const cartDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const notificationMessages = [
    "Flash Sale: Save 30% on Web Development courses today.",
    "Limited Offer: Get 20% off when you buy 2+ courses.",
    "Weekend Deal: Extra 15% discount on AI and ML tracks.",
  ];

  useEffect(() => {
    let active = true;

    async function fetchCourseDetails() {
      if (!id) {
        setError("Invalid course id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetchStudentViewCourseDetailsService(id);

        if (!active) return;

        if (response?.success && response?.course) {
          setCourse(response.course);
          return;
        }

        setError(response?.message || "Could not load course details.");
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load course details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCourseDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const categoryLabel = useMemo(() => {
    if (!course?.category) return "Course";
    return (
      courseCategories.find((category) => category.id === course.category)?.label ||
      "Course"
    );
  }, [course?.category]);

  const lectureCount = course?.curriculum?.length || 0;
  const freePreviewCount =
    course?.curriculum?.filter((lecture) => lecture?.freePreview).length || 0;
  const freeSampleVideos = useMemo(() => {
    return (course?.curriculum || [])
      .map((lecture, index) => ({
        index,
        title: lecture?.title || `Lecture ${index + 1}`,
        url: getLectureVideoUrl(lecture),
        duration: formatDuration(getLectureDuration(lecture)),
        thumbnail: lecture?.thumbnail || lecture?.image?.url || course?.image?.url || "/course-placeholder.png",
        freePreview: !!lecture?.freePreview,
      }))
      .filter((lecture) => lecture.freePreview && lecture.url);
  }, [course?.curriculum, course?.image?.url]);
  const learningPoints = useMemo(() => buildLearningPoints(course), [course]);
  const isFreeCourse = Number(course?.pricing) === 0;
  const isInCart = isCourseInCart(course?._id || course?.id);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredCurriculum = useMemo(() => {
    const curriculum = course?.curriculum || [];
    if (!normalizedSearchTerm) return curriculum;
    return curriculum.filter((lecture) =>
      (lecture?.title || "").toLowerCase().includes(normalizedSearchTerm)
    );
  }, [course?.curriculum, normalizedSearchTerm]);

  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      setSearchCourses([]);
      setIsSearchingCourses(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearchingCourses(true);
        const response = await searchStudentCoursesService(query);
        const courses =
          response?.courses ||
          response?.data ||
          response?.result ||
          [];
        setSearchCourses(Array.isArray(courses) ? courses : []);
      } catch {
        setSearchCourses([]);
      } finally {
        setIsSearchingCourses(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    setIsPrimaryActionDone(false);
    setPreviewLecture(null);
    setPreviewError("");
  }, [course?._id]);

  useEffect(() => {
    if (!previewLecture) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [previewLecture]);

  useEffect(() => {
    setPreviewError("");
  }, [previewLecture?.url]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!showCartDropdown) return;
      if (!cartDropdownRef.current?.contains(event.target)) {
        setShowCartDropdown(false);
      }
      if (
        showNotificationDropdown &&
        !notificationDropdownRef.current?.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showCartDropdown, showNotificationDropdown]);

  useEffect(() => {
    setSelectedCheckoutCourseIds((prev) => {
      const cartIds = new Set(cartItems.map((item) => item?._id).filter(Boolean));
      const kept = prev.filter((idValue) => cartIds.has(idValue));
      if (kept.length > 0) return kept;
      return Array.from(cartIds);
    });
  }, [cartItems]);

  const handleBack = () => {
    const from = location.state?.from;
    if (from) {
      navigate(from);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/dashboard");
  };

  const handlePrimaryActionClick = () => {
    if (isFreeCourse) {
      setIsPrimaryActionDone(true);
      return;
    }

    addCourseToCart(course);
    setShowCartDropdown(true);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    setSearchTerm(query);
    sessionStorage.setItem("courseSearchTerm", query);
    setShowSearchResults(false);
    navigate(`/dashboard?q=${encodeURIComponent(query)}`);
  };

  const handleSearchIconClick = () => {
    handleSearchSubmit();
  };

  const handleOpenCourseFromSearch = (courseId) => {
    setShowSearchResults(false);
    setSearchInput("");
    setSearchCourses([]);
    navigate(`/dashboard/course-details/${courseId}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const handleBuyNowClick = () => {
    navigate(`/dashboard/course-details/${id}/payment`, {
      state: {
        course,
        from: `${location.pathname}${location.search}`,
      },
    });
  };

  const handleCheckoutFromCartItem = (cartCourse) => {
    if (!cartCourse?._id) return;
    setShowCartDropdown(false);
    navigate(`/dashboard/course-details/${cartCourse._id}/payment`, {
      state: {
        course: cartCourse,
        from: `${location.pathname}${location.search}`,
      },
    });
  };

  const handleCheckoutAllClick = () => {
    const selectedCourses = cartItems.filter((item) =>
      selectedCheckoutCourseIds.includes(item?._id),
    );
    if (selectedCourses.length === 0) return;
    setShowCartDropdown(false);
    navigate(`/dashboard/course-details/${id}/payment`, {
      state: {
        courses: selectedCourses,
        from: `${location.pathname}${location.search}`,
      },
    });
  };

  const handleCheckoutSelectionToggle = (courseId) => {
    if (!courseId) return;
    setSelectedCheckoutCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((idValue) => idValue !== courseId)
        : [...prev, courseId],
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-slate-500">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#184EF0]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error || "Course not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      {showAnnouncement && (
        <div className="relative bg-[#184EF0]/70 px-10 py-2 text-center text-xs font-semibold text-white sm:text-sm">
          New courses added weekly. Explore trending topics and keep learning.
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-base leading-none text-white/90 hover:bg-white/15 hover:text-white"
            aria-label="Close announcement"
          >
            ×
          </button>
        </div>
      )}
      <div className="sticky top-0 z-50 border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#184EF0]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <Link to="/" className="hidden items-center gap-1.5 sm:flex ml-50">
            <GraduationCap className="h-7 w-7 text-[#F97316]" />
            <span className="text-xl font-semibold">
              Edu<span className="text-[#F97316]">Nest</span>
            </span>
          </Link>

          <div className="flex-1 flex justify-center px-2">
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
              <StyledSearchBar>
                <div className="input-container">
                  <input
                    type="text"
                    name="text"
                    className="input"
                    placeholder={t("search")}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setSearchTerm(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                  />
                  <span className="icon" onClick={handleSearchIconClick}>
                    <svg
                      width="22px"
                      height="22px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        <path
                          opacity={1}
                          d="M14 5H20"
                          stroke="#808080"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          opacity={1}
                          d="M14 8H17"
                          stroke="#808080"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                          stroke="#808080"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          opacity={1}
                          d="M22 22L20 20"
                          stroke="#808080"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </StyledSearchBar>

              {showSearchResults && searchInput.length > 0 && (
                <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-[360px]">
                  <div className="p-3">
                    <p className="text-sm text-gray-500 px-2 py-1">
                      {t("search_press_enter")}{" "}
                      <span className="font-semibold">{searchInput}</span>
                    </p>
                    <div className="border-t mt-2 pt-2">
                      <p className="text-xs text-gray-400 px-2 mb-1">
                        {t("quick_suggestions")}
                      </p>
                      {isSearchingCourses ? (
                        <p className="px-3 py-2 text-sm text-gray-500">Searching...</p>
                      ) : searchCourses.length > 0 ? (
                        searchCourses.slice(0, 6).map((resultCourse) => (
                          <button
                            key={resultCourse?._id || resultCourse?.id}
                            type="button"
                            onClick={() =>
                              handleOpenCourseFromSearch(resultCourse?._id || resultCourse?.id)
                            }
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
                          >
                            <span>🔍</span>
                            <span>{resultCourse?.title || "Untitled course"}</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-gray-500">No matching courses found.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={cartDropdownRef}>
            <button
              type="button"
              onClick={() => setShowCartDropdown((prev) => !prev)}
              className="relative"
              aria-label="Cart"
            >
              <img src="/shopping-cart.png" alt="Cart" className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
              {showCartDropdown && (
                <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-slate-600">Your cart is empty.</p>
                  ) : (
                    <>
                      <div className="max-h-64 space-y-2 overflow-auto pr-1">
                        {cartItems.map((item) => (
                          <div
                            key={item?._id}
                            className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0"
                          >
                            <img
                              src={item?.image?.url || "/course-placeholder.png"}
                              alt={item?.title || "Course"}
                              className="h-12 w-16 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {item?.title || "Untitled course"}
                              </p>
                              <p className="text-xs text-slate-500">{formatPrice(item?.pricing)}</p>
                              <div className="mt-1 flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleCheckoutFromCartItem(item)}
                                  className="text-xs font-semibold text-[#184EF0] hover:underline"
                                >
                                  Checkout
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeCourseFromCart(item?._id)}
                                  className="text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedCheckoutCourseIds.includes(item?._id)}
                              onChange={() => handleCheckoutSelectionToggle(item?._id)}
                              className="h-4 w-4 shrink-0 accent-[#184EF0]"
                              aria-label={`Select ${item?.title || "course"} for checkout`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 border-t border-slate-200 pt-2 text-sm font-semibold text-slate-700">
                        Total: {formatPrice(cartTotal)}
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckoutAllClick}
                        disabled={selectedCheckoutCourseIds.length === 0}
                        className={`mt-3 inline-flex h-9 w-full items-center justify-center px-3 text-sm font-semibold text-white ${
                          selectedCheckoutCourseIds.length === 0
                            ? "cursor-not-allowed bg-slate-400"
                            : "bg-[#184EF0] hover:bg-[#123fd0]"
                        }`}
                      >
                        Checkout Selected ({selectedCheckoutCourseIds.length})
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={notificationDropdownRef}>
            <button
              type="button"
              className="relative"
              aria-label="Notifications"
              onClick={() => setShowNotificationDropdown((prev) => !prev)}
            >
              <img src="/notification.png" alt="Notifications" className="h-6 w-6" />
              <span className="absolute -top-1 -right-0 bg-[#F97316] h-2.5 w-2.5 rounded-full" />
            </button>
            {showNotificationDropdown && (
              <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#184EF0]">
                  Discount Alerts
                </p>
                <div className="space-y-2">
                  {notificationMessages.map((message, index) => (
                    <p
                      key={`${message}-${index}`}
                      className="border-b border-slate-100 pb-2 text-xs text-slate-700 last:border-b-0 last:pb-0"
                    >
                      {message}
                    </p>
                  ))}
                </div>
              </div>
            )}
            </div>

            {/* <button type="button" className="relative" aria-label="Wishlist">
              <img src="/love.png" alt="Wishlist" className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button> */}
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden pb-10 pt-7 text-white">
        <div className="absolute left-0 right-0 top-0 h-[400px] sm:h-[320px] lg:h-[420px]">
          <img
            src={course.image?.url || "/course-placeholder.png"}
            alt={course.title}
            className="h-full w-full object-cover blur-[16px] scale-100"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 sm:px-6 lg:grid-cols-12 lg:px-8 mt-13">
          <div className="lg:col-span-8 lg:pr-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9b4ff]">
              {categoryLabel}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">
              {course.subtitle || "Master practical skills through step-by-step guided lessons."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <UserRound size={15} />
                Created by {course.instructor?.name || "Instructor"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Signal size={15} />
                {formatLevel(course.level)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 size={15} />
                {course.language || "English"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <BookOpen size={15} />
                {lectureCount} lectures
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={15} />
                Self-paced learning
              </span>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="overflow-hidden border border-slate-200 bg-white text-slate-900 lg:sticky lg:top-6">
              <img
                src={course.image?.url || "/course-placeholder.png"}
                alt={course.title}
                className="h-[220px] w-full object-cover"
              />

              <div className="p-5">
                <p className="text-3xl font-bold text-[#1c1d1f]">{formatPrice(course.pricing)}</p>

                <div className="mt-4">
                  <AnimatedButton
                    size="md"
                    onClick={handlePrimaryActionClick}
                    primaryText={
                      isFreeCourse
                        ? isPrimaryActionDone
                          ? "Continue Learning"
                          : "Start Learning"
                        : isInCart
                          ? "Added to Cart"
                          : "Add to Cart"
                    }
                    secondaryText={
                      isFreeCourse
                        ? isPrimaryActionDone
                          ? "Open Course"
                          : "Start Now"
                        : isInCart
                          ? "Added to Cart"
                          : "Add Now"
                    }
                    secondaryTextColor="#ffffff"
                    fullWidth
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center border border-[#184EF0]/70 px-4 text-sm font-bold text-[#184EF0] transition-colors duration-200 hover:bg-[#184EF0]/5"
                >
                  Buy Now
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  30-Day Money-Back Guarantee
                </p>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-sm font-bold text-slate-900">This course includes:</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CirclePlay size={15} />
                      {lectureCount} on-demand lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen size={15} />
                      Full lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe2 size={15} />
                      Access on mobile and desktop
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-0 mx-auto -mt-76 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 -mt-86">
          <main className="space-y-6 lg:col-span-8">
            <article className="border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1c1d1f]">What you'll learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {learningPoints.map((point, index) => (
                  <p key={`${point}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#184EF0]" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>
            </article>

            <article className="border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1c1d1f]">Course content</h2>
              <p className="mt-1 text-sm text-slate-600">
                {lectureCount} lectures • {freePreviewCount} free preview
              </p>

              <div className="mt-4 border border-slate-200">
                {lectureCount === 0 ? (
                  <div className="bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Curriculum is not available yet.
                  </div>
                ) : (
                  course.curriculum.map((lecture, index) => (
                    <div
                      key={`${lecture.title}-${index}`}
                      className={`flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 ${
                        previewLecture?.index === index ? "bg-[#eef4ff]" : "bg-white"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1c1d1f]">
                          {index + 1}. {lecture.title || "Untitled Lecture"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {lecture.freePreview
                            ? "Free preview available"
                            : "Locked content (enroll to unlock)"}
                        </p>
                      </div>

                      {lecture.freePreview ? (
                        <button
                          type="button"
                          onClick={() => {
                            const url = getLectureVideoUrl(lecture);
                            if (!url) return;
                            setPreviewLecture({
                              index,
                              title: lecture?.title || "Lecture preview",
                              url,
                            });
                            setPreviewError("");
                          }}
                          disabled={!getLectureVideoUrl(lecture)}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CirclePlay size={13} />
                          {getLectureVideoUrl(lecture) ? "Preview" : "No video"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          <Lock size={13} />
                          Locked
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1c1d1f]">Description</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {course.detailedDescription ||
                  course.description ||
                  "Detailed course information will appear here."}
              </p>
            </article>

            <article className="border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1c1d1f]">Instructor</h2>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {course.instructor?.name || "Instructor"}
              </p>
              <p className="mt-1 text-sm text-slate-600">{course.instructor?.email || ""}</p>
            </article>
          </main>

          <aside className="space-y-4 lg:col-span-4">
            <div className="border border-[#184EF0]/20 -mt-10 bg-[#f4f8ff] px-4 py-3 text-sm text-slate-700 sm:mt-75">
              Signed in as <span className="font-semibold">{currentUser?.name || "Student"}</span>
            </div>
          </aside>
        </div>
      </section>

      {previewLecture?.url && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
          onClick={() => setPreviewLecture(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-700 bg-[#0b1220] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-200">
              <p className="truncate font-semibold">
                Now previewing: {previewLecture.title || "Lecture preview"}
              </p>
              <button
                type="button"
                onClick={() => setPreviewLecture(null)}
                className="shrink-0 rounded border border-slate-600 px-2 py-0.5 text-base leading-none text-slate-200 hover:bg-slate-800"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
            <div className="relative aspect-video max-h-[72vh] w-full overflow-hidden rounded-md border border-slate-700 bg-black">
              <video
                key={previewLecture.url}
                src={previewLecture.url}
                controls
                preload="metadata"
                onLoadedData={() => setPreviewError("")}
                onError={() =>
                  setPreviewError("This preview could not be loaded. Try another video.")
                }
                className="h-full w-full object-contain"
              />
              {previewError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center text-sm text-slate-100">
                  {previewError}
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="relative inline-block px-1.5 py-0.5 text-sm font-bold text-white">
                Free Sample Videos:
                <svg
                  className="pointer-events-none absolute -bottom-1 left-10 h-2 w-[88%]"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C22 2 42 11 62 7C82 3 102 10 118 6"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </p>

              <div className="mt-2 overflow-hidden rounded-md border border-slate-700 bg-[#0f172a]">
                {freeSampleVideos.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-300">
                    No free sample videos available.
                  </div>
                ) : (
                  freeSampleVideos.map((lecture) => (
                    <button
                      key={`${lecture.index}-${lecture.url}`}
                      type="button"
                      onClick={() => setPreviewLecture(lecture)}
                      className={`flex w-full items-center justify-between gap-3 border-b border-slate-700 px-4 py-3 text-left last:border-b-0 ${
                        previewLecture?.url === lecture.url
                          ? "bg-slate-700/60"
                          : "hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={lecture.thumbnail}
                          alt={lecture.title}
                          className="h-10 w-16 shrink-0 rounded object-cover"
                        />
                        <p className="line-clamp-2 text-sm font-semibold text-slate-100">
                          {lecture.title}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-slate-200">
                        {lecture.duration}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <hr className="border-0 h-px bg-slate-200" />
      <Footer />
    </div>
  );
}
