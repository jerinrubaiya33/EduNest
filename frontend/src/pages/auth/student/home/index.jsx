// student/home/index.jsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context/AuthContext";
import { useStudent } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { courseCategories } from "@/config";
import { Code, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Stats from "./stats";
import Head from "./header";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Comment from "./comment";
import Footer from "./footer";
import Newsletter from "./newsletter";
import FindHelp from "./findhelp";
import Events from "./events";
import TopPick from "./toppick";

const categoryIcons = {
  "web-development": "/coding (1).png",
  "backend-development": "/backend-development.png",
  "data-science": "/exploratory-analysis.png",
  "machine-learning": "/machine-learning.png",
  "artificial-intelligence": "/artificial-intelligence.png",
  "cloud-computing": "/cloud-computing.png",
  "cyber-security": "/hacker (1).png",
  "mobile-development": "/app.png",
  "game-development": "/gamepad.png",
  "software-engineering": "/programming (1).png",
  database: "/query.png",
  python: "/python.png",
};

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const apiBase =
    (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      ""
    ).replace(/\/$/, "") || window.location.origin;

  const {
    selectedCategory,
    setSelectedCategory,
    enrolledCourses,
    setEnrolledCourses,
    loading,
    setLoading,
    fetchError,
    setFetchError,
  } = useStudent();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeDataSciencePage, setActiveDataSciencePage] = useState(0);
  const [dataSciencePageCount, setDataSciencePageCount] = useState(1);
  const [activeWebDevPage, setActiveWebDevPage] = useState(0);
  const [webDevPageCount, setWebDevPageCount] = useState(1);
  const [activeStudentsViewingPage, setActiveStudentsViewingPage] = useState(0);
  const [studentsViewingPageCount, setStudentsViewingPageCount] = useState(1);
  const [activeStartLearningPage, setActiveStartLearningPage] = useState(0);
  const [startLearningPageCount, setStartLearningPageCount] = useState(1);
  const svgRefs = useRef([]);
  const statsSectionRef = useRef(null);
  const dataScienceScrollRef = useRef(null);
  const webDevScrollRef = useRef(null);
  const studentsViewingScrollRef = useRef(null);
  const startLearningScrollRef = useRef(null);
  const learningSectionRef = useRef(null);
  const startLearningSectionRef = useRef(null);

  const handleViewCourse = (courseId) => {
    if (!courseId) return;
    navigate(`/dashboard/course-details/${courseId}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const handleCourseCardKeyDown = (e, courseId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewCourse(courseId);
    }
  };

  // Check for search term from navbar
  useEffect(() => {
    const searchFromStorage = sessionStorage.getItem("courseSearchTerm");
    if (searchFromStorage) {
      setSearchTerm(searchFromStorage);
      // Clear the storage after reading
      sessionStorage.removeItem("courseSearchTerm");
    }
  }, []);

  /* FETCH COURSES */
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setFetchError("");

        const response = await fetchStudentViewCourseListService("");

        if (response?.success) {
          setEnrolledCourses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch student courses:", error);
        setEnrolledCourses([]);
        setFetchError(
          error?.response?.data?.message ||
          error?.message ||
          "Backend is unavailable on http://localhost:5000.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [setEnrolledCourses, setFetchError, setLoading]);

  /* SEARCH FILTER - enhanced to search in title, subtitle, and category */
  const categoryIds = new Set(courseCategories.map((cat) => cat.id));

  const filteredCourses = enrolledCourses.filter((course) => {
    const categoryMatch =
      !selectedCategory ||
      !categoryIds.has(selectedCategory) ||
      course.category === selectedCategory;

    if (!categoryMatch) return false;
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const categoryLabel =
      courseCategories.find((cat) => cat.id === course.category)?.label || "";

    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.subtitle?.toLowerCase().includes(searchLower) ||
      categoryLabel.toLowerCase().includes(searchLower) ||
      course.instructor?.name?.toLowerCase().includes(searchLower)
    );
  });

  const startLearningPriority = {
    "backend-development": 0,
    "data-science": 1,
  };

  const startLearningCourses = [...filteredCourses].sort((a, b) => {
    const priorityA =
      startLearningPriority[(a?.category || "").toLowerCase()] ?? 2;
    const priorityB =
      startLearningPriority[(b?.category || "").toLowerCase()] ?? 2;

    if (priorityA !== priorityB) return priorityA - priorityB;
    return 0;
  });

  const startLearningSlides = [];
  for (let i = 0; i < startLearningCourses.length; i += 8) {
    startLearningSlides.push(startLearningCourses.slice(i, i + 8));
  }

  const dataScienceCourses = enrolledCourses.filter((course) => {
    const title = (course?.title || "").toLowerCase();
    const subtitle = (course?.subtitle || "").toLowerCase();
    const categoryId = (course?.category || "").toLowerCase();

    return (
      title.includes("data science") ||
      subtitle.includes("data science") ||
      title.includes("machine learning") ||
      subtitle.includes("machine learning") ||
      categoryId === "data-science" ||
      categoryId === "machine-learning"
    );
  });

  const webDevelopmentCourses = enrolledCourses.filter((course) => {
    const title = (course?.title || "").toLowerCase();
    const subtitle = (course?.subtitle || "").toLowerCase();
    const categoryId = (course?.category || "").toLowerCase();

    return (
      categoryId === "web-development" ||
      categoryId === "backend-development" ||
      title.includes("web development") ||
      subtitle.includes("web development") ||
      title.includes("frontend") ||
      subtitle.includes("frontend") ||
      title.includes("backend") ||
      subtitle.includes("backend") ||
      title.includes("react") ||
      subtitle.includes("react") ||
      title.includes("javascript") ||
      subtitle.includes("javascript")
    );
  });

  const studentsViewingOrder = {
    "cloud-computing": 0,
    "machine-learning": 1,
    "cyber-security": 2,
    "data-science": 3,
    database: 4,
  };

  const studentsViewingCourses = enrolledCourses
    .filter((course) => {
      const categoryId = (course?.category || "").toLowerCase();
      return studentsViewingOrder[categoryId] !== undefined;
    })
    .sort((a, b) => {
      const categoryA = (a?.category || "").toLowerCase();
      const categoryB = (b?.category || "").toLowerCase();
      return studentsViewingOrder[categoryA] - studentsViewingOrder[categoryB];
    });

  const machineLearningTopPick =
    enrolledCourses.find(
      (course) => (course?.category || "").toLowerCase() === "machine-learning",
    ) ||
    filteredCourses.find(
      (course) => (course?.category || "").toLowerCase() === "machine-learning",
    );

  const topPickCourse =
    machineLearningTopPick ||
    studentsViewingCourses[0] ||
    filteredCourses[0] ||
    enrolledCourses[0] ||
    null;
  const topPickCategoryLabel = topPickCourse
    ? courseCategories.find((c) => c.id === topPickCourse.category)?.label ||
    "Course"
    : "Course";

  // Function to highlight search terms in text
  const highlightSearchTerm = (text) => {
    if (!searchTerm || !text) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // Function to auto-select category based on search
  useEffect(() => {
    if (searchTerm) {
      // Check if search term matches any category
      const matchedCategory = courseCategories.find((category) =>
        category.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      }
    }
  }, [searchTerm, setSelectedCategory]);

  // SVG mouse interaction effect for multiple SVGs
  useEffect(() => {
    const canUseHoverEffects =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseHoverEffects || prefersReducedMotion) return;

    const svgElements = svgRefs.current;
    const statsElement = statsSectionRef.current;

    if (!statsElement || svgElements.length === 0) return;

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

    // Initialize base positions
    svgData.forEach((data, index) => {
      if (data.element) {
        const rect = data.element.getBoundingClientRect();
        const parentRect = statsElement.getBoundingClientRect();
        data.baseX = rect.left - parentRect.left + rect.width / 2;
        data.baseY = rect.top - parentRect.top + rect.height / 2;
        data.currentX = 0;
        data.currentY = 0;
        data.targetX = 0;
        data.targetY = 0;
      }
    });

    // Repulsion strength and radius
    const repulsionStrength = 50; // How far the SVG moves away from cursor
    const repulsionRadius = 200; // Distance at which effect is maximum
    const smoothness = 0.15; // Lower = smoother, slower movement

    const handleMouseMove = (e) => {
      const rect = statsElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      svgData.forEach((data) => {
        if (!data.element) return;

        // Calculate distance between mouse and SVG center
        const dx = data.baseX - mouseX;
        const dy = data.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
          // Calculate repulsion force (stronger when closer)
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(dy, dx);

          // Calculate target position (move away from mouse)
          data.targetX = Math.cos(angle) * force * repulsionStrength;
          data.targetY = Math.sin(angle) * force * repulsionStrength;
        } else {
          // Return to center when mouse is far
          data.targetX = 0;
          data.targetY = 0;
        }
      });
    };

    const handleMouseLeave = () => {
      // Return to center when mouse leaves section
      svgData.forEach((data) => {
        data.targetX = 0;
        data.targetY = 0;
      });
    };

    // Smooth animation loop
    const animate = () => {
      svgData.forEach((data) => {
        if (!data.element) return;

        // Smooth interpolation
        data.currentX += (data.targetX - data.currentX) * smoothness;
        data.currentY += (data.targetY - data.currentY) * smoothness;

        // Apply transform
        data.element.style.transform = `translate(${data.currentX}px, ${data.currentY}px)`;
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Add event listeners
    statsElement.addEventListener("mousemove", handleMouseMove);
    statsElement.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      statsElement.removeEventListener("mousemove", handleMouseMove);
      statsElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Function to add ref to array
  const addSvgRef = (el) => {
    if (el && !svgRefs.current.includes(el)) {
      svgRefs.current.push(el);
    }
  };

  const scrollDataScienceCourses = (direction) => {
    if (!dataScienceScrollRef.current) return;
    const scrollAmount = dataScienceScrollRef.current.clientWidth;
    dataScienceScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollWebDevCourses = (direction) => {
    if (!webDevScrollRef.current) return;
    const scrollAmount = webDevScrollRef.current.clientWidth;
    webDevScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollStartLearningCourses = (direction) => {
    if (!startLearningScrollRef.current) return;
    const scrollAmount = startLearningScrollRef.current.clientWidth;
    startLearningScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollStudentsViewingCourses = (direction) => {
    if (!studentsViewingScrollRef.current) return;
    const scrollAmount = studentsViewingScrollRef.current.clientWidth;
    studentsViewingScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToStartLearningSection = () => {
    if (!startLearningSectionRef.current) return;
    const topOffset = 120;
    const sectionTop =
      startLearningSectionRef.current.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - topOffset),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = dataScienceScrollRef.current;
    if (!container) return;

    const updatePagination = () => {
      const pageWidth = container.clientWidth || 1;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      const pageCount = Math.max(
        1,
        Math.ceil((maxScroll + pageWidth) / pageWidth),
      );
      const page = Math.min(
        pageCount - 1,
        Math.max(0, Math.round(container.scrollLeft / pageWidth)),
      );

      setDataSciencePageCount(pageCount);
      setActiveDataSciencePage(page);
    };

    updatePagination();
    container.addEventListener("scroll", updatePagination, { passive: true });
    window.addEventListener("resize", updatePagination);

    return () => {
      container.removeEventListener("scroll", updatePagination);
      window.removeEventListener("resize", updatePagination);
    };
  }, [dataScienceCourses.length]);

  useEffect(() => {
    const container = webDevScrollRef.current;
    if (!container) return;

    const updatePagination = () => {
      const pageWidth = container.clientWidth || 1;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      const pageCount = Math.max(
        1,
        Math.ceil((maxScroll + pageWidth) / pageWidth),
      );
      const page = Math.min(
        pageCount - 1,
        Math.max(0, Math.round(container.scrollLeft / pageWidth)),
      );

      setWebDevPageCount(pageCount);
      setActiveWebDevPage(page);
    };

    updatePagination();
    container.addEventListener("scroll", updatePagination, { passive: true });
    window.addEventListener("resize", updatePagination);

    return () => {
      container.removeEventListener("scroll", updatePagination);
      window.removeEventListener("resize", updatePagination);
    };
  }, [webDevelopmentCourses.length]);

  useEffect(() => {
    const container = studentsViewingScrollRef.current;
    if (!container) return;

    const updatePagination = () => {
      const pageWidth = container.clientWidth || 1;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      const pageCount = Math.max(
        1,
        Math.ceil((maxScroll + pageWidth) / pageWidth),
      );
      const page = Math.min(
        pageCount - 1,
        Math.max(0, Math.round(container.scrollLeft / pageWidth)),
      );

      setStudentsViewingPageCount(pageCount);
      setActiveStudentsViewingPage(page);
    };

    updatePagination();
    container.addEventListener("scroll", updatePagination, { passive: true });
    window.addEventListener("resize", updatePagination);

    return () => {
      container.removeEventListener("scroll", updatePagination);
      window.removeEventListener("resize", updatePagination);
    };
  }, [studentsViewingCourses.length]);

  useEffect(() => {
    const container = startLearningScrollRef.current;
    if (!container) return;

    const updatePagination = () => {
      const pageWidth = container.clientWidth || 1;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      const pageCount = Math.max(
        1,
        Math.ceil((maxScroll + pageWidth) / pageWidth),
      );
      const page = Math.min(
        pageCount - 1,
        Math.max(0, Math.round(container.scrollLeft / pageWidth)),
      );

      setStartLearningPageCount(pageCount);
      setActiveStartLearningPage(page);
    };

    updatePagination();
    container.addEventListener("scroll", updatePagination, { passive: true });
    window.addEventListener("resize", updatePagination);

    return () => {
      container.removeEventListener("scroll", updatePagination);
      window.removeEventListener("resize", updatePagination);
    };
  }, [startLearningSlides.length]);

  const trendingCourses = [
    {
      title: "Reactjs",
      id: "react-1",
      courseTitle: "ReactJS Fundamentals",
      subtitle: "Build modern interfaces with reusable components.",
      image: "/react2.png",
    },
    {
      title: "Cyber",
      id: "cyber-1",
      courseTitle: "Cyber Security Essentials",
      subtitle: "Understand threats, defense, and safe practices.",
      image: "/Cyber2.png",
    },
    {
      title: "Data Science",
      id: "ds-1",
      courseTitle: "Data Science Fundamentals",
      subtitle: "Analyze data and build insights using practical workflows.",
      image: "/data2.png",
    },
    {
      title: "Cloud Computing",
      id: "cloud-1",
      courseTitle: "Cloud Computing Essentials",
      subtitle: "Learn deployment, storage, and scalable cloud architecture.",
      image: "/cloud3.png",
      imageClass: "object-[center_35%]",
    },
    {
      title: "Machine Learning",
      id: "ml-1",
      courseTitle: "Machine Learning Starter",
      subtitle: "Learn model training, evaluation, and deployment basics.",
      image: "/machine2.png",
    },
    {
      title: "Cloud Computing",
      id: "cloud-2",
      courseTitle: "Cloud Infrastructure Basics",
      subtitle: "Understand virtual machines, networking, and cloud services.",
      image: "/cloud7.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 bg2-grid">
        <div className="p-5 mt-8 max-w-6xl mx-auto w-full">
          {/* Head Section */}
          <Head />

          {/* Stats Section */}
          <Stats />

          {/* Categories */}
          <div
            ref={learningSectionRef}
            className="relative left-1/2 right-1/2 -mx-[51vw] w-screen bg-[#ffffff] pb-4"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-5">
              <section className="-mt-107 sm:-mt-32 md:-mt-52 lg:-mt-106">
                <div className="mb-8 sm:mb-12 text-left bg-[#ffffff]">
                  <h2 className="text-[1.4rem] sm:text-[1.6rem] md:text-[1.75rem] font-bold text-[#2D3436] relative inline-block mt-5 ">
                    Explore Course Categories
                    {/* Curve underline */}
                    <svg
                      className="absolute -bottom-2 sm:-bottom-3 sm:left-12 left-22 w-[200px] sm:w-full"
                      width="300"
                      height="20"
                      viewBox="0 0 300 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10"
                        stroke="#F97316"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {courseCategories.map((category) => {
                    const categoryIcon = categoryIcons[category.id] || Code;
                    const isImageIcon = typeof categoryIcon === "string";
                    const Icon = !isImageIcon ? categoryIcon : null;
                    const isActive = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(isActive ? null : category.id);
                          requestAnimationFrame(scrollToStartLearningSection);
                        }}
                        className={`group px-3 sm:px-4.5 py-3 sm:py-4.5 rounded-sm border w-full text-left tracking-wide
                        transition-all duration-300 ease-out
                        hover:shadow-lg hover:-translate-y-1
                        ${isActive
                            ? "border-[#F97316] bg-[#F97316] shadow-md"
                            : "border-[#184EF0]/30 bg-[#f3f3f3] hover:bg-[#F97316] hover:border-[#F97316]"
                          }
                  `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Icon */}
                            <div
                              className={`p-0 transition-all duration-300 flex-shrink-0
                              ${isActive
                                  ? "text-white"
                                  : " text-[#184EF0] group-hover:text-white"
                                }
                `}
                            >
                              {isImageIcon ? (
                                <img
                                  src={categoryIcon}
                                  alt={`${category.label} icon`}
                                  className={`-mb-1 object-contain ${category.id === "python"
                                      ? "w-[24px] h-[24px] sm:w-[36px] sm:h-[36px]"
                                      : "w-[26px] h-[26px] sm:w-[44px] sm:h-[44px]"
                                    }`}
                                />
                              ) : (
                                <Icon
                                  size={20}
                                  className="sm:w-[22px] sm:h-[22px]"
                                />
                              )}
                            </div>

                            {/* Text - Left aligned */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`text-[0.82rem] sm:text-[0.9rem] font-medium transition-colors duration-300 break-words line-clamp-2 sm:line-clamp-none
                                ${isActive ? "text-white" : "text-gray-800 group-hover:text-white"}
                              `}
                              >
                                {highlightSearchTerm(category.label)}
                              </h3>
                            </div>
                          </div>

                          {/* Circular Arrow Button - Gray by default, Green on hover */}
                          <div className="ml-2 flex-shrink-0">
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300
                              ${isActive
                                  ? "bg-white text-[#F97316]"
                                  : "bg-gray-50 text-[#184EF0] group-hover:bg-white group-hover:text-[#F97316]"
                                }
                              `}
                            >
                              <svg
                                className="w-3 sm:w-4 h-8 sm:h-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>

          {/* Search Results Header */}
          {searchTerm && (
            <div className="mt-16 mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800">
                🔍 Search Results for: "{searchTerm}"
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                Found {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""} matching your search
                {selectedCategory &&
                  ` in ${courseCategories.find((c) => c.id === selectedCategory)?.label}`}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}

          <div
            ref={startLearningSectionRef}
            className="relative left-1/2 right-1/2 -mt-10 -mx-[51vw] w-screen bg-white"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-5">
              {/* Section Header */}
              <div className="mt-22 sm:mt-25 mb-8 sm:mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">

                {/* Left title */}
                <div>
                  <h2 className="text-[1.35rem] sm:text-[1.75rem] font-bold text-[#2D3436] leading-tight">
                    Let's{" "}
                    <span className="relative inline-block">
                      start learning
                      <svg
                        className="absolute -bottom-2 left-0 w-full"
                        width="100%"
                        height="10"
                        viewBox="0 0 100 12"
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0,6 C20,0 40,12 60,6 C80,0 100,12 100, 11"
                          stroke="#F97316"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </h2>

                  {(searchTerm || selectedCategory) && (
                    <p className="mt-2 text-sm text-gray-600 ">
                      Showing {filteredCourses.length} course
                      {filteredCourses.length !== 1 ? "s" : ""}
                      {searchTerm && ` for "${searchTerm}"`}
                      {selectedCategory &&
                        ` in ${courseCategories.find(
                          (c) => c.id === selectedCategory,
                        )?.label
                        }`}
                    </p>
                  )}
                </div>

                {/* Right tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: null, label: "All" },
                    { id: "trending", label: "Trending" },
                    { id: "popular", label: "Popularity" },
                  ].map((tab) => {
                    const isActive =
                      (!tab.id && !selectedCategory && !searchTerm) ||
                      selectedCategory === tab.id;

                    return (
                      <button
                        key={tab.label}
                        onClick={() => {
                          setSelectedCategory(tab.id);
                          setSearchTerm("");
                        }}
                        className={`rounded-full border px-3 sm:px-5 py-1.5 sm:py-2 text-[0.8rem] sm:text-[0.95rem] font-semibold transition
                    ${isActive
                            ? "border-[#184EF0] bg-[#184EF0] text-white"
                            : "border-blue-200 bg-white text-gray-700 hover:border-[#184EF0] hover:bg-[#184EF0] hover:text-white"
                          }
                    `}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Courses */}
              <section className="mt-6 sm:mt-10">
                {loading ? (
                  <p className="text-center text-base sm:text-xl text-gray-500">
                    Loading courses...
                  </p>
                ) : fetchError ? (
                  <div className="border border-red-200 bg-red-50 px-4 sm:px-6 py-8 sm:py-10 text-center shadow-sm">
                    <h3 className="text-lg sm:text-xl font-semibold text-red-700">
                      Backend Connection Failed
                    </h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-red-600">
                      {fetchError}
                    </p>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                      Confirm the backend is reachable:{" "}
                      <code className="break-all">{`${apiBase}/api/student/courses`}</code>{" "}
                      should
                      return JSON.
                    </p>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="border border-slate-200 bg-gradient-to-br from-white to-slate-50/60 px-4 sm:px-6 py-12 sm:py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center text-[#184EF0]">
                      <img
                        src="/web-developer.png"
                        alt="No matching courses"
                        className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#184EF0]">
                      No Matching Courses Found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                      {searchTerm
                        ? `No courses found for "${searchTerm}". Try a different search term.`
                        : selectedCategory
                          ? `No courses available in ${courseCategories.find(
                            (c) => c.id === selectedCategory,
                          )?.label
                          }. Try another category.`
                          : "Try searching with a different keyword or explore categories above."}
                    </p>

                    {(selectedCategory || searchTerm) && (
                      <AnimatedButton
                        className="mt-6 mx-auto"
                        size="lg"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchTerm("");
                        }}
                        primaryText="View All Courses"
                        secondaryText="See All"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => scrollStartLearningCourses("left")}
                        className="hidden sm:flex absolute -left-3 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="mx-auto h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollStartLearningCourses("right")}
                        className="hidden sm:flex absolute -right-3 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="mx-auto h-5 w-5" />
                      </button>

                      <div
                        ref={startLearningScrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1 snap-x snap-mandatory overscroll-x-contain touch-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {startLearningSlides.map((slideCourses, slideIndex) => (
                          <div
                            key={`start-learning-slide-${slideIndex}`}
                            className="min-w-full snap-start"
                          >
                            <div className="grid grid-cols-1 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                              {slideCourses.map((course) => (
                                <div
                                  key={course._id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => handleViewCourse(course._id)}
                                  onKeyDown={(e) =>
                                    handleCourseCardKeyDown(e, course._id)
                                  }
                                  className="w-full bg-white rounded-sm border border-gray-200 overflow-hidden
                      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer "
                                >
                                  {/* Image wrapper */}
                                  <div className="relative h-46 sm:h-36 md:h-38 overflow-hidden bg-slate-100 p-2 sm:p-0">
                                    <img
                                      src={
                                        course.image?.url ||
                                        "/course-placeholder.png"
                                      }
                                      alt={course.title}
                                      className="w-full h-full object-cover sm:object-cover"
                                      loading="lazy"
                                      decoding="async"
                                      draggable={false}
                                    />

                                    {/* Price badge */}
                                    <div className="absolute top-3 left-3 bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-sm shadow">
                                      {course.pricing === 0
                                        ? "FREE"
                                        : `$${course.pricing}`}
                                    </div>

                                    {/* Level badge */}
                                    <div
                                      className="absolute bottom-3 left-3 bg-white text-[#184EF0]
                          text-xs font-semibold px-3 py-1 rounded shadow"
                                    >
                                      {course.level
                                        ? course.level.charAt(0).toUpperCase() +
                                        course.level.slice(1)
                                        : "Beginner"}
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-2.5 sm:p-4">
                                    {/* Category */}
                                    <p className="text-xs  font-semibold text-[#184EF0] uppercase tracking-wide">
                                      {courseCategories.find(
                                        (c) => c.id === course.category,
                                      )?.label || "Course"}
                                    </p>

                                    {/* Title */}
                                    <h3 className="mt-1 text-sm sm:text-sm font-semibold text-gray-700 leading-snug line-clamp-2">
                                      {highlightSearchTerm(course.title)}
                                    </h3>

                                    {/* Subtitle */}
                                    <p className="mt-1 text-xs sm:text-xs text-gray-600 line-clamp-2">
                                      {highlightSearchTerm(course.subtitle)}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex text-yellow-400 text-xs">
                                        ★★★★☆
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        (0 / 5)
                                      </span>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-1 flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                          />
                                        </svg>
                                        <span className="-ml-1">
                                          {course.instructor?.name ||
                                            "Instructor"}
                                        </span>
                                      </div>

                                      {/* Use the imported AnimatedButton */}
                                      <AnimatedButton
                                        size="xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewCourse(course._id);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-2">
                      {Array.from({ length: startLearningPageCount }).map(
                        (_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              if (startLearningScrollRef.current) {
                                const container =
                                  startLearningScrollRef.current;
                                const scrollAmount =
                                  container.offsetWidth * index;
                                container.scrollTo({
                                  left: scrollAmount,
                                  behavior: "smooth",
                                });
                                setActiveStartLearningPage(index);
                              }
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 w-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${activeStartLearningPage === index
                                ? "bg-[#184EF0] w-6"
                                : "bg-[#184EF0]/40"
                              }`}
                          />
                        ),
                      )}
                    </div>
                  </>
                )}

                {!loading && (
                  <div className="mt-10">
                    <h3 className="relative inline-block mt-7 mb-7 text-[1.25rem] sm:text-[1.75rem] font-bold text-[#2D3436]">
                      Data Science Foundation Program
                      <svg
                        className="absolute -bottom-3 left-21 sm:left-82 -translate-x-1/2 w-[180px] sm:w-[300px]"
                        width="300"
                        height="20"
                        viewBox="0 0 300 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10"
                          stroke="#F97316"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </h3>

                    {dataScienceCourses.length === 0 ? (
                      <p className="mt-4 text-sm text-gray-600">
                        No data science courses available right now.
                      </p>
                    ) : (
                      <>
                        <div className="relative mt-4">
                          <button
                            type="button"
                            onClick={() => scrollDataScienceCourses("left")}
                            className="hidden sm:flex absolute -left-3 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft className="mx-auto h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollDataScienceCourses("right")}
                            className="hidden sm:flex absolute -right-3 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll right"
                          >
                            <ChevronRight className="mx-auto h-5 w-5" />
                          </button>
                          <div
                            ref={dataScienceScrollRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1 snap-x snap-mandatory overscroll-x-contain touch-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                          >
                            {dataScienceCourses.map((course) => (
                              <div
                                key={course._id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleViewCourse(course._id)}
                                onKeyDown={(e) =>
                                  handleCourseCardKeyDown(e, course._id)
                                }
                                className="min-w-[72vw] sm:min-w-[230px] lg:min-w-[250px] flex-shrink-0 snap-start bg-white rounded-sm border border-gray-200 overflow-hidden
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer "
                              >
                                <div className="relative h-36 sm:h-32 overflow-hidden bg-slate-100 p-2 sm:p-0">
                                  <img
                                    src={
                                      course.image?.url ||
                                      "/course-placeholder.png"
                                    }
                                    alt={course.title}
                                    className="w-full h-full object-contain sm:object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                  />

                                  <div className="absolute top-3 left-3 bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-sm shadow">
                                    {course.pricing === 0
                                      ? "FREE"
                                      : `$${course.pricing}`}
                                  </div>

                                  <div
                                    className="absolute bottom-3 left-3 bg-white text-[#184EF0]
                                text-xs font-semibold px-3 py-1 rounded shadow"
                                  >
                                    {course.level
                                      ? course.level.charAt(0).toUpperCase() +
                                      course.level.slice(1)
                                      : "Beginner"}
                                  </div>
                                </div>

                                <div className="p-2.5 sm:p-2.5">
                                  <p className="text-xs font-semibold text-[#184EF0] uppercase tracking-wide">
                                    {courseCategories.find(
                                      (c) => c.id === course.category,
                                    )?.label || "Course"}
                                  </p>

                                  <h3 className="mt-1 text-base sm:text-base font-semibold text-gray-700 leading-snug line-clamp-2">
                                    {highlightSearchTerm(course.title)}
                                  </h3>

                                  <p className="mt-1 text-xs sm:text-xs text-gray-600 line-clamp-2">
                                    {highlightSearchTerm(course.subtitle)}
                                  </p>

                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400 text-xs">
                                      ★★★★☆
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      (0 / 5)
                                    </span>
                                  </div>

                                  <div className="mt-0 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                      <span className="-ml-0">
                                        {course.instructor?.name ||
                                          "Instructor"}
                                      </span>
                                    </div>

                                    <AnimatedButton
                                      size="xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewCourse(course._id);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-2">
                          {Array.from({ length: dataSciencePageCount }).map(
                            (_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (dataScienceScrollRef.current) {
                                    const container =
                                      dataScienceScrollRef.current;
                                    const scrollAmount =
                                      container.offsetWidth * index;
                                    container.scrollTo({
                                      left: scrollAmount,
                                      behavior: "smooth",
                                    });
                                    setActiveDataSciencePage(index);
                                  }
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`h-2 w-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${activeDataSciencePage === index
                                    ? "bg-[#184EF0] w-6"
                                    : "bg-[#184EF0]/40"
                                  }`}
                              />
                            ),
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!loading && (
                  <div className="mt-0">
                    <h3 className="relative inline-block mt-7 mb-7 text-[1.25rem] sm:text-[1.75rem] font-bold text-[#2D3436]">
                      Web Development Program
                      <svg
                        className="absolute -bottom-3 left-40 sm:left-62 -translate-x-1/2 w-[240px] sm:w-[300px]"
                        width="300"
                        height="20"
                        viewBox="0 0 300 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10"
                          stroke="#F97316"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </h3>

                    {webDevelopmentCourses.length === 0 ? (
                      <p className="mt-4 text-sm text-gray-600">
                        No web development courses available right now.
                      </p>
                    ) : (
                      <>
                        <div className="relative mt-4">
                          <button
                            type="button"
                            onClick={() => scrollWebDevCourses("left")}
                            className="hidden sm:flex absolute -left-3 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft className="mx-auto h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollWebDevCourses("right")}
                            className="hidden sm:flex absolute -right-3 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll right"
                          >
                            <ChevronRight className="mx-auto h-5 w-5" />
                          </button>
                          <div
                            ref={webDevScrollRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1 snap-x snap-mandatory overscroll-x-contain touch-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                          >
                            {webDevelopmentCourses.map((course) => (
                              <div
                                key={course._id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleViewCourse(course._id)}
                                onKeyDown={(e) =>
                                  handleCourseCardKeyDown(e, course._id)
                                }
                                className="min-w-[72vw] sm:min-w-[220px] lg:min-w-[240px] flex-shrink-0 snap-start bg-white rounded-sm border border-gray-200 overflow-hidden
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer "
                              >
                                <div className="relative h-36 sm:h-30 overflow-hidden bg-slate-100 p-2 sm:p-0">
                                  <img
                                    src={
                                      course.image?.url ||
                                      "/course-placeholder.png"
                                    }
                                    alt={course.title}
                                    className="w-full h-full object-contain sm:object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                  />

                                  <div className="absolute top-3 left-3 bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-sm shadow">
                                    {course.pricing === 0
                                      ? "FREE"
                                      : `$${course.pricing}`}
                                  </div>

                                  <div
                                    className="absolute bottom-3 left-3 bg-white text-[#184EF0]
                                text-xs font-semibold px-3 py-1 rounded shadow"
                                  >
                                    {course.level
                                      ? course.level.charAt(0).toUpperCase() +
                                      course.level.slice(1)
                                      : "Beginner"}
                                  </div>
                                </div>

                                <div className="p-2.5 sm:p-2.5">
                                  <p className="text-xs font-semibold text-[#184EF0] uppercase tracking-wide">
                                    {courseCategories.find(
                                      (c) => c.id === course.category,
                                    )?.label || "Course"}
                                  </p>

                                  <h3 className="mt-1 text-base sm:text-base font-semibold text-gray-700 leading-snug line-clamp-2">
                                    {highlightSearchTerm(course.title)}
                                  </h3>

                                  <p className="mt-1 text-xs sm:text-xs text-gray-600 line-clamp-2">
                                    {highlightSearchTerm(course.subtitle)}
                                  </p>

                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400 text-xs">
                                      ★★★★☆
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      (0 / 5)
                                    </span>
                                  </div>

                                  <div className="mt-0 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm  text-gray-500">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                      <span>
                                        {course.instructor?.name ||
                                          "Instructor"}
                                      </span>
                                    </div>

                                    <AnimatedButton
                                      size="xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewCourse(course._id);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          {Array.from({ length: webDevPageCount }).map(
                            (_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (webDevScrollRef.current) {
                                    const container = webDevScrollRef.current;
                                    const scrollAmount =
                                      container.offsetWidth * index;
                                    container.scrollTo({
                                      left: scrollAmount,
                                      behavior: "smooth",
                                    });
                                    setActiveWebDevPage(index);
                                  }
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`h-2 w-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${activeWebDevPage === index
                                    ? "bg-[#184EF0] w-6"
                                    : "bg-[#184EF0]/40"
                                  }`}
                              />
                            ),
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!loading && (
                  <TopPick
                    course={topPickCourse}
                    categoryLabel={topPickCategoryLabel}
                  />
                )}

                {!loading && (
                  <div className="-mt-2">
                    <h3 className="relative inline-block mt-7 mb-7 text-[1.25rem] sm:text-[1.75rem] font-bold text-[#2D3436] ">
                      Students are Viewing
                      <svg
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[220px] sm:w-[300px]"
                        width="300"
                        height="20"
                        viewBox="0 0 300 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10"
                          stroke="#F97316"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </h3>

                    {studentsViewingCourses.length === 0 ? (
                      <p className="mt-4 text-sm text-gray-600">
                        No cloud computing, machine learning, cyber security,
                        data science, or data analytics courses available right
                        now.
                      </p>
                    ) : (
                      <>
                        <div className="relative mt-4">
                          <button
                            type="button"
                            onClick={() => scrollStudentsViewingCourses("left")}
                            className="hidden sm:flex absolute -left-3 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft className="mx-auto h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              scrollStudentsViewingCourses("right")
                            }
                            className="hidden sm:flex absolute -right-3 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full border border-[#184EF0]/25 bg-white text-[#184EF0] shadow-sm transition-colors hover:bg-[#184EF0] hover:text-white"
                            aria-label="Scroll right"
                          >
                            <ChevronRight className="mx-auto h-5 w-5" />
                          </button>
                          <div
                            ref={studentsViewingScrollRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-4 sm:pr-10 pl-1 snap-x snap-mandatory overscroll-x-contain touch-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                          >
                            {studentsViewingCourses.map((course) => (
                              <div
                                key={course._id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleViewCourse(course._id)}
                                onKeyDown={(e) =>
                                  handleCourseCardKeyDown(e, course._id)
                                }
                                className="min-w-[72vw] sm:min-w-[230px] lg:min-w-[250px] flex-shrink-0 snap-start bg-white rounded-sm border border-gray-200 overflow-hidden
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer "
                              >
                                <div className="relative h-36 sm:h-32 overflow-hidden bg-slate-100 p-2 sm:p-0">
                                  <img
                                    src={
                                      course.image?.url ||
                                      "/course-placeholder.png"
                                    }
                                    alt={course.title}
                                    className="w-full h-full object-contain sm:object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                  />

                                  <div className="absolute top-3 left-3 bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-sm shadow">
                                    {course.pricing === 0
                                      ? "FREE"
                                      : `$${course.pricing}`}
                                  </div>

                                  <div
                                    className="absolute bottom-3 left-3 bg-white text-[#184EF0]
                                text-xs font-semibold px-3 py-1 rounded shadow"
                                  >
                                    {course.level
                                      ? course.level.charAt(0).toUpperCase() +
                                      course.level.slice(1)
                                      : "Beginner"}
                                  </div>
                                </div>

                                <div className="p-2.5 sm:p-2.5">
                                  <p className="text-xs font-semibold text-[#184EF0] uppercase tracking-wide">
                                    {courseCategories.find(
                                      (c) => c.id === course.category,
                                    )?.label || "Course"}
                                  </p>

                                  <h4 className="mt-1 text-base sm:text-base font-semibold text-gray-700 leading-snug line-clamp-2">
                                    {highlightSearchTerm(course.title)}
                                  </h4>

                                  <p className="mt-1 text-xs sm:text-xs text-gray-600 line-clamp-2">
                                    {highlightSearchTerm(course.subtitle)}
                                  </p>

                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex text-yellow-400 text-xs">
                                      ★★★★☆
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      (0 / 5)
                                    </span>
                                  </div>

                                  <div className="mt-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                      <span className="-ml-1">
                                        {course.instructor?.name ||
                                          "Instructor"}
                                      </span>
                                    </div>

                                    <AnimatedButton
                                      size="xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewCourse(course._id);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-2">
                          {Array.from({ length: studentsViewingPageCount }).map(
                            (_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (studentsViewingScrollRef.current) {
                                    const container =
                                      studentsViewingScrollRef.current;
                                    const scrollAmount =
                                      container.offsetWidth * index;
                                    container.scrollTo({
                                      left: scrollAmount,
                                      behavior: "smooth",
                                    });
                                    setActiveStudentsViewingPage(index);
                                  }
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`h-2 w-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${activeStudentsViewingPage === index
                                    ? "bg-[#184EF0] w-6"
                                    : "bg-[#184EF0]/40"
                                  }`}
                              />
                            ),
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>

        </div>
        <FindHelp />
        <section className="mt-0 bg-white">
          <div className="mb-8">
            <h2 className="relative inline-block mb-7 font-bold text-[#2D3436] mt-9 text-[1.25rem] sm:text-[1.75rem] px-4 sm:px-0 sm:ml-11">
              Read The Documentations About Some Courses
              <svg
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[260px] sm:w-[320px]"
                width="320"
                height="16"
                viewBox="0 0 320 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C56 -1 106 17 160 10C214 3 264 17 318 8"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-19">
            {trendingCourses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-sm border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`overflow-hidden ${course.id === "ds-1" ? "h-36 sm:h-40 p-0" : "h-40"}`}
                >
                  <img
                    src={course.image}
                    alt={course.courseTitle}
                    className={`h-full w-full ${course.id === "ds-1" ? "object-cover" : "object-cover"}`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#184EF0]">
                    {course.title}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-gray-700">
                    {course.courseTitle}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {course.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Comment />
        <Events />
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}
