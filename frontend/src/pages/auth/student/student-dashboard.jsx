import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useStudent } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { courseCategories } from "@/config";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  CirclePlay,
  Clock3,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import Footer from "./home/footer";

const categoryIcons = {
  "web-development": "/coding (1).png",
  "backend-development": "/api (3).png",
  "data-science": "/exploratory-analysis.png",
  "machine-learning": "/machine-learning.png",
  "artificial-intelligence": "/artificial-intelligence.png",
  "cloud-computing": "/cloud-computing.png",
  "cyber-security": "/hacker (1).png",
  "mobile-development": "/app.png",
  "game-development": "/gamepad.png",
  "software-engineering": "/programming (1).png",
  database: "/data2.png",
  python: "/programming (1).png",
};

function FilterCheckbox({ checked, onChange, label, count }) {
  return (
    <label className="group flex cursor-pointer items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-[#184EF0]/40">
      <span className="flex items-center gap-2">
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <span className="absolute inset-0 rounded border-2 border-[#e8e8eb] bg-[#f8fafc] transition-all duration-300 group-hover:border-[#0b76ef] peer-checked:border-[#0b76ef] peer-checked:bg-[#0b76ef]" />
          <span className="relative z-10 flex items-center justify-center text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100">
            <svg viewBox="0 0 16 14" width="14" height="14" fill="none">
              <path
                d="M2 8.5L6 12.5L14 1.5"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        {label}
      </span>
      <span className="text-xs text-slate-500">({count})</span>
    </label>
  );
}

export default function Dashboard() {
  const {
    selectedCategory,
    setSelectedCategory,
    enrolledCourses,
    setEnrolledCourses,
    loading,
    setLoading,
    fetchError,
    setFetchError,
    cartItems,
    cartCount,
    cartTotal,
    addCourseToCart,
    removeCourseFromCart,
    isCourseInCart,
  } = useStudent();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || "");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showAnnouncementCartInfo, setShowAnnouncementCartInfo] = useState(false);
  const [wishlistPopupCourseId, setWishlistPopupCourseId] = useState(null);
  const [addedCartCourseId, setAddedCartCourseId] = useState(null);
  const notificationCount = 3;
  const svgRefs = useRef([]);
  const headSectionRef = useRef(null);
  const courseSectionRef = useRef(null);
  const wishlistPopupTimeoutRef = useRef(null);
  const addedCartTimeoutRef = useRef(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setFetchError("");
        const response = await fetchStudentViewCourseListService("");
        if (response?.success) setEnrolledCourses(response.data);
      } catch (error) {
        console.error(error);
        setEnrolledCourses([]);
        setFetchError(
          error?.response?.data?.message ||
            "Backend is unavailable on http://localhost:5000."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [setEnrolledCourses, setFetchError, setLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const searchFromStorage = sessionStorage.getItem("courseSearchTerm");
    if (!searchFromStorage) return;
    setSearchTerm((prev) => (prev.trim() ? prev : searchFromStorage));
    sessionStorage.removeItem("courseSearchTerm");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedPriceTypes.length) {
      params.set("price", selectedPriceTypes.join(","));
    }
    if (selectedLevels.length) {
      params.set("level", selectedLevels.join(","));
    }
    setSearchParams(params, { replace: true });
  }, [
    selectedCategory,
    searchTerm,
    selectedPriceTypes,
    selectedLevels,
    setSearchParams,
  ]);

  const normalizeLevel = (level) =>
    (level || "").toString().trim().toLowerCase().replace(/\s+/g, "-");

  const filteredCourses = enrolledCourses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const categoryLabel =
      courseCategories.find((cat) => cat.id === course.category)?.label || "";
    const matchesSearch =
      !searchTerm.trim() ||
      course.title?.toLowerCase().includes(searchLower) ||
      course.subtitle?.toLowerCase().includes(searchLower) ||
      categoryLabel.toLowerCase().includes(searchLower) ||
      course.instructor?.name?.toLowerCase().includes(searchLower);
    const numericPrice = Number(course?.pricing);
    const priceType = numericPrice === 0 ? "free" : "paid";
    const matchesPrice =
      selectedPriceTypes.length === 0 || selectedPriceTypes.includes(priceType);
    const matchesLevel =
      selectedLevels.length === 0 ||
      selectedLevels.includes(normalizeLevel(course?.level));

    const matchesCategory =
      !selectedCategory || course?.category === selectedCategory;

    return matchesCategory && matchesSearch && matchesPrice && matchesLevel;
  });

  const courseCountByCategory = useMemo(() => {
    const counts = {};
    enrolledCourses.forEach((course) => {
      const id = course?.category;
      if (!id) return;
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [enrolledCourses]);

  const priceCounts = useMemo(() => {
    return enrolledCourses.reduce(
      (counts, course) => {
        const numericPrice = Number(course?.pricing);
        if (numericPrice === 0) counts.free += 1;
        else counts.paid += 1;
        return counts;
      },
      { free: 0, paid: 0 },
    );
  }, [enrolledCourses]);

  const levelCounts = useMemo(() => {
    const counts = {
      all: enrolledCourses.length,
      beginner: 0,
      intermediate: 0,
      expert: 0,
    };
    enrolledCourses.forEach((course) => {
      const normalized = normalizeLevel(course?.level);
      if (normalized === "beginner") counts.beginner += 1;
      if (normalized === "intermediate") counts.intermediate += 1;
      if (normalized === "expert") counts.expert += 1;
    });
    return counts;
  }, [enrolledCourses]);

  const activeCategoryLabel = selectedCategory
    ? courseCategories.find((cat) => cat.id === selectedCategory)?.label ||
      "Category"
    : "All Courses";

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setSelectedLevels([]);
    setSelectedPriceTypes([]);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    requestAnimationFrame(() => {
      if (!courseSectionRef.current) return;
      const targetTop =
        window.scrollY +
        courseSectionRef.current.getBoundingClientRect().top -
        70;
      window.scrollTo({ top: targetTop, left: 0, behavior: "smooth" });
    });
  };

  const handlePriceToggle = (priceType) => {
    setSelectedPriceTypes((prev) =>
      prev.includes(priceType)
        ? prev.filter((type) => type !== priceType)
        : [...prev, priceType],
    );
    requestAnimationFrame(() => {
      if (!courseSectionRef.current) return;
      const targetTop =
        window.scrollY +
        courseSectionRef.current.getBoundingClientRect().top -
        70;
      window.scrollTo({ top: targetTop, left: 0, behavior: "smooth" });
    });
  };

  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((selected) => selected !== level)
        : [...prev, level],
    );
    requestAnimationFrame(() => {
      if (!courseSectionRef.current) return;
      const targetTop =
        window.scrollY +
        courseSectionRef.current.getBoundingClientRect().top -
        70;
      window.scrollTo({ top: targetTop, left: 0, behavior: "smooth" });
    });
  };

  const handleAllLevelsSelect = () => {
    setSelectedLevels([]);
    requestAnimationFrame(() => {
      if (!courseSectionRef.current) return;
      const targetTop =
        window.scrollY +
        courseSectionRef.current.getBoundingClientRect().top -
        70;
      window.scrollTo({ top: targetTop, left: 0, behavior: "smooth" });
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return "FREE";
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) return "$0.00";
    return `$${numericPrice.toFixed(2)}`;
  };

  const formatLevel = (level) => {
    if (!level) return "All Levels";
    return level
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const getCourseDescription = (course) => {
    const candidates = [
      course?.description,
      course?.detailedDescription,
      course?.subtitle,
      course?.courseLandingFormData?.description,
      course?.courseLandingFormData?.detailedDescription,
      course?.courseLandingFormData?.subtitle,
    ];

    const text = candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    );

    return (
      text?.trim() ||
      "Master practical concepts through real-world guided lessons."
    );
  };

  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  const handleWishlistHover = (courseId) => {
    setWishlistPopupCourseId(courseId);
    if (wishlistPopupTimeoutRef.current) {
      clearTimeout(wishlistPopupTimeoutRef.current);
    }
  };

  const handleAddToCart = (course) => {
    const added = addCourseToCart(course);
    if (!added) return;

    setAddedCartCourseId(course?._id || course?.id || null);

    if (addedCartTimeoutRef.current) {
      clearTimeout(addedCartTimeoutRef.current);
    }

    addedCartTimeoutRef.current = setTimeout(() => {
      setAddedCartCourseId(null);
    }, 1800);
  };

  // SVG mouse interaction effect for multiple SVGs
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

  useEffect(() => {
    return () => {
      if (wishlistPopupTimeoutRef.current) {
        clearTimeout(wishlistPopupTimeoutRef.current);
      }
      if (addedCartTimeoutRef.current) {
        clearTimeout(addedCartTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {showAnnouncement && (
        <div className="fixed top-0 left-0 right-0 z-50 overflow-visible bg-[#184EF0]/90 text-sm font-bold text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="inline-flex h-8 w-8 items-center justify-center text-white transition hover:bg-white hover:text-[#184EF0]"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="flex-1 px-3 text-center tracking-wider">
              3 new courses added this week! Explore now →
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowAnnouncementCartInfo((prev) => !prev)
                  }
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-[#184EF0]"
                  aria-label={`Cart with ${cartCount} items`}
                >
                  <ShoppingCart size={16} />
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F97316] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                </button>
                {showAnnouncementCartInfo && (
                  <div className="absolute right-0 top-10 z-50 w-[320px] rounded-sm border border-slate-200 bg-white p-3 text-slate-800 shadow-xl">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#184EF0]">
                        Cart Items
                      </p>
                      <span className="text-xs font-semibold text-slate-500">
                        {cartCount} item{cartCount !== 1 ? "s" : ""}
                      </span>
                    </div>
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
                                className="h-12 w-16 rounded-sm object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <Link
                                  to={`/dashboard/course-details/${item?._id}`}
                                  onClick={() => setShowAnnouncementCartInfo(false)}
                                  className="block truncate text-sm font-semibold text-slate-800 hover:text-[#184EF0]"
                                >
                                  {item?.title || "Untitled course"}
                                </Link>
                                <p className="text-xs text-slate-500">
                                  {formatPrice(item?.pricing)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeCourseFromCart(item?._id)}
                                  className="mt-1 text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 border-t border-slate-200 pt-2 text-sm font-semibold text-slate-700">
                          Total: {formatPrice(cartTotal)}
                        </div>
                        <Link
                          to={`/dashboard/course-details/${cartItems[0]?._id}/payment`}
                          state={{
                            selectedCourseIds: cartItems.map((item) => item?._id),
                            from: `${location.pathname}${location.search}`,
                          }}
                          onClick={() => setShowAnnouncementCartInfo(false)}
                          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-sm bg-[#184EF0] px-3 text-sm font-semibold text-white transition hover:bg-[#123fd0]"
                        >
                          Checkout
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-[#184EF0]"
                aria-label={`Notifications with ${notificationCount} alerts`}
              >
                <Bell size={16} />
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F97316] px-1 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              </button>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="inline-flex h-8 w-8 items-center justify-center text-white transition hover:opacity-80"
                aria-label="Close announcement"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mb-6 h-[290px] overflow-hidden bg-white sm:h-[480px] w-screen -left-11.5 -top-9">
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
            }}
          >
            <img
              src="/Studying.png"
              alt="Learning dashboard banner"
              className="h-full w-full scale-[1.02] object-cover blur-[2px]"
            />
            <div className="absolute inset-0 bg-slate-500/20 backdrop-blur-[1px]" />
          </div>
          <div className="absolute left-6 top-1/2 mt-6 -translate-y-1/2 text-white">
            <p className="text-base font-bold uppercase tracking-[0.2em] text-[#184EF0]">
              Welcome Back
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Upgrade Your Skills. Unlock Your Potential.
            </h2>
            <p className="mt-2 max-w-md text-base text-white]">
              Access expert-led courses designed to help you grow faster.
            </p>
          </div>
        </div>

        <div
          ref={headSectionRef}
          className="relative mb-12 -mt-5 overflow-hidden border border-slate-200 bg-[#fafdffe3] p-5 shadow-sm sm:p-6"
        >
          <svg
            ref={addSvgRef}
            className="pointer-events-none absolute -left-[140px] -top-[108px] z-0 transition-transform duration-100 ease-out"
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
            className="pointer-events-none absolute right-[0px] top-[32px] z-0 transition-transform duration-100 ease-out"
            width="190"
            height="190"
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
            className="pointer-events-none absolute left-[600px] -top-[119px] z-0 transition-transform duration-100 ease-out"
            width="210"
            height="210"
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
            Student Dashboard
          </p>
          <h1 className="relative z-10 mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Discover Courses
          </h1>
          <p className="relative z-10 mt-1 text-sm text-slate-600">
            Browse categories and find courses that match your learning goals.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="space-y-6">
              <div className="border border-slate-200 bg-[#FAFDFF] p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-500">
                  <SlidersHorizontal size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Filters
                  </span>
                </div>

                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#184EF0] focus:ring-1 focus:ring-[#184EF0]"
                  />
                </div>

                <button
                  onClick={clearFilters}
                  className="mt-4 w-full bg-white border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  RESET FILTERS
                </button>
              </div>
              
              {/* Category List */}
              <div className="border border-slate-200 bg-[#FAFDFF] overflow-hidden">
                <div className="border-b border-slate-200 bg-white px-4 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category Name
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`snap-start flex w-full items-center justify-between p-4 text-sm font-bold transition hover:bg-[#F97316] hover:text-white ${
                      !selectedCategory
                        ? "bg-[#ffffff17] text-gray-800"
                        : "text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <img
                        src="/online-learning.png"
                        className="h-6 w-6 object-contain"
                        alt="All Courses icon"
                      />
                      All Courses
                    </span>
                    <span className="opacity-60">{enrolledCourses.length}</span>
                  </button>

                  {courseCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`snap-start flex w-full items-center justify-between p-4 text-sm font-semibold border-t border-slate-100 transition ${
                        selectedCategory === cat.id
                          ? "bg-[#184EF0] text-white"
                          : "hover:bg-[#F97316] hover:text-white text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-3 truncate">
                        <img
                          src={
                            categoryIcons[cat.id] || "/course-placeholder.png"
                          }
                          className="h-6 w-6 object-contain "
                          alt=""
                        />
                        <span className="truncate">{cat.label}</span>
                      </span>
                      <span className="text-xs opacity-60">
                        {courseCountByCategory[cat.id] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 bg-[#FAFDFF] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Filter by
                </p>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </p>
                  <div className="mt-2 space-y-2">
                    <FilterCheckbox
                      checked={selectedPriceTypes.includes("free")}
                      onChange={() => handlePriceToggle("free")}
                      label="Free"
                      count={priceCounts.free}
                    />
                    <FilterCheckbox
                      checked={selectedPriceTypes.includes("paid")}
                      onChange={() => handlePriceToggle("paid")}
                      label="Paid"
                      count={priceCounts.paid}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Level
                  </p>
                  <div className="mt-2 space-y-2">
                    <FilterCheckbox
                      checked={selectedLevels.length === 0}
                      onChange={handleAllLevelsSelect}
                      label="All Levels"
                      count={levelCounts.all}
                    />
                    <FilterCheckbox
                      checked={selectedLevels.includes("beginner")}
                      onChange={() => handleLevelToggle("beginner")}
                      label="Beginner"
                      count={levelCounts.beginner}
                    />
                    <FilterCheckbox
                      checked={selectedLevels.includes("intermediate")}
                      onChange={() => handleLevelToggle("intermediate")}
                      label="Intermediate"
                      count={levelCounts.intermediate}
                    />
                    <FilterCheckbox
                      checked={selectedLevels.includes("expert")}
                      onChange={() => handleLevelToggle("expert")}
                      label="Expert"
                      count={levelCounts.expert}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section
            ref={courseSectionRef}
            className="lg:col-span-9 xl:col-span-10"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {activeCategoryLabel === "All Courses" ? (
                  <span className="relative inline-block pb-2">
                    {activeCategoryLabel}
                     <svg
                      className="absolute -bottom-1 left-10 w-[70%]"
                      width="300"
                      height="20"
                      viewBox="0 0 300 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10"
                        stroke="#F97316"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                ) : (
                  activeCategoryLabel
                )}
              </h2>
              <span className=" border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center  border border-slate-200 bg-white py-20 shadow-sm">
                <div className="h-10 w-10 animate-spin  border-b-2 border-[#184EF0]" />
              </div>
            ) : fetchError ? (
              <div className="border border-red-200 bg-red-50 py-16 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-red-700">
                  Backend Connection Failed
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-red-600">
                  {fetchError}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Confirm the backend is running and
                  {" "}
                  <code>http://localhost:5000/api/student/courses</code>
                  {" "}
                  opens in the browser.
                </p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="border border-slate-200 bg-gradient-to-br from-white to-slate-50/60 py-16 text-center shadow-sm">
                <div className="mx-auto -mb-4 inline-flex items-center justify-center text-[#184EF0]">
                  <img
                    src="/web-developer.png"
                    alt="No matching courses"
                    className="h-30 w-30 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#184EF0]">
                  No Matching Courses Found
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  We couldn&apos;t find any courses for your current filters.
                  Adjust the category, search term, price, or level to discover
                  relevant results.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center justify-center border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-[#184EF0] hover:text-[#184EF0]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[0.94rem] font-semibold text-slate-700">
                  We found {filteredCourses.length} courses available for you
                </p>

                {filteredCourses.map((course) => (
                  <article
                    key={course._id}
                    className="group grid grid-cols-1 gap-4 border-b border-slate-200 pb-5 last:border-b-0 sm:grid-cols-12"
                  >
                    <div className="relative overflow-hidden sm:col-span-6 lg:col-span-5">
                      <img
                        src={course.image?.url || "/course-placeholder.png"}
                        alt={course.title}
                        className="h-[200px] w-full rounded-md bg-slate-50 object-cover"
                      />
                    </div>

                    <div className="sm:col-span-4 lg:col-span-5 ml-3">
                      <p className="text-[0.84rem] font-medium text-[#1e63c6]">
                        {courseCategories.find((c) => c.id === course.category)
                          ?.label || "Course"}
                      </p>

                      <h3 className="mt-1 text-[0.41rem] leading-tight font-semibold text-slate-900 lg:text-[1.4rem]">
                        {course.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.82rem] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <CirclePlay size={16} />
                          {course.curriculum?.length || 4} Lessons
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={16} />
                          {course.duration || "18.8 hours"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BarChart3 size={16} />
                          {formatLevel(course.level)}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-[0.95rem] text-slate-600">
                        {getCourseDescription(course)}
                      </p>

                      <div className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500">
                        <UserRound size={15} />
                        <span>{course.instructor?.name || "Instructor"}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <Link
                          to={`/dashboard/course-details/${course._id}`}
                          state={{ from: `${location.pathname}${location.search}` }}
                          className="inline-flex h-9 items-center justify-center rounded-sm border border-[#184EF0] bg-[#184EF0] px-5 text-sm font-semibold text-white transition hover:bg-[#123fd0]"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(course)}
                          disabled={isCourseInCart(course._id)}
                          className={`h-9 -mt-1 overflow-hidden rounded-sm border ${
                            isCourseInCart(course._id)
                              ? "cursor-not-allowed border-[#F97316] bg-[#F97316] text-white"
                              : "border-[#184EF0]"
                          }`}
                          aria-label={
                            isCourseInCart(course._id)
                              ? "Already added to cart"
                              : "Add to cart"
                          }
                        >
                          {isCourseInCart(course._id) ? (
                            <span className="flex h-9 items-center justify-center whitespace-nowrap px-5 text-sm font-semibold">
                              Added to cart
                            </span>
                          ) : (
                            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-9">
                              <span className="flex h-9 items-center justify-center whitespace-nowrap bg-white px-5 text-sm font-semibold text-[#184EF0]">
                                Add to cart
                              </span>
                              <span className="flex h-9 items-center justify-center whitespace-nowrap bg-[#184EF0] px-5 text-sm font-semibold text-white">
                                Add to cart
                              </span>
                            </span>
                          )}
                        </button>
                        {addedCartCourseId === course._id && (
                          <span className="text-xs font-semibold text-[#F97316]">
                            Cart added
                          </span>
                        )}
                        <div className="relative">
                          {wishlistPopupCourseId === course._id && (
                            <div className="absolute -top-14 left-1/2 z-20 -translate-x-1/2">
                              <div className="relative mt-6 ml-13 whitespace-nowrap rounded-full border-1 border-[#F97316] bg-white px-3 py-1 text-[10px] font-semibold text-[#F97316] shadow-sm">
                                Add to your wishlist
                                <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#F97316] bg-white" />
                              </div>
                            </div>
                          )}
                          <button
                            onMouseEnter={() => handleWishlistHover(course._id)}
                            onMouseLeave={() => setWishlistPopupCourseId(null)}
                            className="h-9 w-12 overflow-hidden rounded-sm border border-slate-300"
                            aria-label="Add to wishlist"
                          >
                            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-9">
                              <span className="flex h-9 w-full items-center justify-center  text-[#8a8a8a]">
                                <span className="relative -mt-1 font-extrabold top-[1px]">
                                  ♡
                                </span>
                              </span>
                              <span className="flex h-9 font-extrabold w-full items-center justify-center bg-[#F97316] -mt-1 text-white">
                                <span className="relative top-[1px]">♡</span>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-end sm:col-span-2 lg:col-span-2">
                      <p className="text-base mt-19 font-semibold text-[#184EF0]">
                        {formatPrice(course.pricing)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <hr className="border-0 h-px bg-slate-200" />
      <Footer />
    </div>
  );
}
