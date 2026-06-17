import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Microscope,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/auth-context/AuthContext";
import { useLang } from "@/context/lang-context";
import { useStudent } from "@/context/student-context";
import StudentDashboard from "@/pages/auth/student/home";
import styled from "styled-components";

// Styled search bar component with increased width and height
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
    padding: 25px 42px 25px 16px;
    transition: 0.2s linear;
    border: 1px solid #badbff;
    font-size: 15px;
    letter-spacing: 0.5px;
    background: #fafafa;
    border-radius: 3px;
  }

  .input:focus {
    outline: none;
    border: 1.5px solid #1877d9;
    box-shadow: -3px -0.2px 0px #1877d9;
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

export default function StudentViewCommonLayout() {
  const { currentUser, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const { cartItems, cartCount, cartTotal, removeCourseFromCart } =
    useStudent();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [isDesktopNavSticky, setIsDesktopNavSticky] = useState(false);
  const [focusMobileSearchOnOpen, setFocusMobileSearchOnOpen] = useState(false);
  const [selectedCheckoutCourseIds, setSelectedCheckoutCourseIds] = useState(
    [],
  );
  const cartDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const notificationMessages = [
    "Flash Sale: Save 30% on Web Development courses today.",
    "Limited Offer: Get 20% off when you buy 2+ courses.",
    "Weekend Deal: Extra 15% discount on AI and ML tracks.",
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showCartDropdown &&
        !cartDropdownRef.current?.contains(event.target)
      ) {
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
    if (!mobileMenuOpen || !focusMobileSearchOnOpen) return;

    requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus?.();
    });
    setFocusMobileSearchOnOpen(false);
  }, [mobileMenuOpen, focusMobileSearchOnOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsDesktopNavSticky(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setSelectedCheckoutCourseIds((prev) => {
      const cartIds = new Set(
        cartItems.map((item) => item?._id).filter(Boolean),
      );
      const kept = prev.filter((idValue) => cartIds.has(idValue));
      if (kept.length > 0) return kept;
      return Array.from(cartIds);
    });
  }, [cartItems]);

  const formatPrice = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue === 0) return "Free";
    return `$${numericValue.toFixed(2)}`;
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleLoginClick() {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate("/auth");
  }

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setLangOpen(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      sessionStorage.setItem("courseSearchTerm", searchInput.trim());
      navigate("/dashboard");
      setSearchInput("");
      setShowSearchResults(false);
    }
  };

  const handleSearchIconClick = () => {
    handleSearchSubmit();
  };

  const handleCheckoutAllClick = () => {
    const selectedCourses = cartItems.filter((item) =>
      selectedCheckoutCourseIds.includes(item?._id),
    );
    if (selectedCourses.length === 0) return;
    const firstCourseId = selectedCourses[0]?._id;
    if (!firstCourseId) return;

    setShowCartDropdown(false);
    navigate(`/dashboard/course-details/${firstCourseId}/payment`, {
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

  return (
    <header className="w-full bg-white font-caveat3">
      {/* ANNOUNCEMENT BAR */}
      {showAnnouncement && !mobileMenuOpen && (
        <div className="bg-[#1877d9] font-semibold text-white -ml-4 text-xs sm:text-[0.92rem] relative">
          <div className="py-2 px-10 sm:px-0">
            <span className="block text-center sm:text-left sm:ml-40 tracking-wider leading-relaxed">
              {t("announcement")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 appearance-none border-0 bg-transparent p-1 text-white shadow-none outline-none hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP UTIL BAR */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Left Section */}
          <div className="flex items-center gap-12 flex-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 ml-14 shrink-0 py-4">
              <Microscope className="h-6 w-6 text-[#F97316]" />
              <span className="text-[1.25rem] leading-none font-semibold text-[#1f2937] tracking-tight">
                Edu
                <span className="text-[#F97316] ml-0.5">Nest</span>
              </span>
            </Link>

            {/* Middle Navigation Links - Layout structured similar to reference */}
            <nav className="hidden ml-35 mt-1 md:flex items-center gap-x-8">
            <Link
                to="/dashboard"
                className="py-[32px] text-md font-medium text-[#2D3748] border-b-2 border-transparent transition duration-200 hover:text-black border-[#F97316] "
              >
                <span className="border-b-1 border-transparent hover:border-[#F97316] pb-2">
                  {t("go_to_courses")}
                </span>
              </Link>

              <Link
                to="/teach"
                className="py-[26px] text-md font-medium text-[#2D3748] transition duration-200 hover:text-black"
              >
                <span className="border-b-1 border-transparent hover:border-[#F97316] pb-2">
                  {t("teach_on_edunest")}
                </span>
              </Link>

              <Link
                to="/my-learning"
                className="py-[26px] text-md font-medium text-[#2D3748] border-b-2 border-transparent transition duration-200 hover:text-black"
                
              >
                 <span className="border-b-1 border-transparent hover:border-[#F97316] pb-2">
                  {t("my_learning")}
                </span>
                
              </Link>


            </nav>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-6 shrink-0 py-4">
            {/* Desktop Utilities (Cart & Notifications) */}
            <div className="hidden sm:flex items-center gap-5">
              {/* Cart */}
              <div className="relative" ref={cartDropdownRef}>
                <button
                  type="button"
                  className="relative flex items-center justify-center p-1"
                  onClick={() => setShowCartDropdown((prev) => !prev)}
                  aria-label="Cart"
                >
                  <img
                    src="/shopping-cart.png"
                    alt="Cart"
                    className="h-5 w-5 opacity-80 hover:opacity-100"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                </button>
                {showCartDropdown && (
                  <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl rounded-lg">
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-slate-600">
                        Your cart is empty.
                      </p>
                    ) : (
                      <>
                        <div className="max-h-64 space-y-2 overflow-auto pr-1">
                          {cartItems.map((item) => (
                            <div
                              key={item?._id}
                              className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0"
                            >
                              <img
                                src={
                                  item?.image?.url || "/course-placeholder.png"
                                }
                                alt={item?.title || "Course"}
                                className="h-12 w-16 object-cover rounded"
                              />
                              <div className="min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowCartDropdown(false);
                                    navigate(
                                      `/dashboard/course-details/${item?._id}`,
                                    );
                                  }}
                                  className="truncate text-left text-sm font-semibold text-slate-800 hover:text-[#184EF0]"
                                >
                                  {item?.title || "Untitled course"}
                                </button>
                                <p className="text-xs text-slate-500">
                                  {formatPrice(item?.pricing)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeCourseFromCart(item?._id)
                                  }
                                  className="mt-1 text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedCheckoutCourseIds.includes(
                                  item?._id,
                                )}
                                onChange={() =>
                                  handleCheckoutSelectionToggle(item?._id)
                                }
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
                          className={`mt-3 inline-flex h-9 w-full items-center justify-center px-3 text-sm font-semibold text-white rounded ${selectedCheckoutCourseIds.length === 0
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

              {/* Notification */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  type="button"
                  className="relative flex items-center justify-center p-1"
                  onClick={() => setShowNotificationDropdown((prev) => !prev)}
                >
                  <img
                    src="/notification.png"
                    alt="Notification"
                    className="h-5 w-5 opacity-80 hover:opacity-100"
                  />
                  <span className="absolute top-1 right-1 bg-[#F97316] h-2 w-2 rounded-full" />
                </button>
                {showNotificationDropdown && (
                  <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl rounded-lg">
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
            </div>

            {/* Mobile View Icons */}
            <div className="flex sm:hidden items-center gap-4">
              <div className="relative" ref={cartDropdownRef}>
                <button
                  type="button"
                  className="relative"
                  onClick={() => setShowCartDropdown((prev) => !prev)}
                  aria-label="Cart"
                >
                  <img
                    src="/shopping-cart.png"
                    alt="Cart"
                    className="h-5 w-5"
                  />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F97316] text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              </div>

              <div className="relative" ref={notificationDropdownRef}>
                <button
                  type="button"
                  className="relative"
                  onClick={() => setShowNotificationDropdown((prev) => !prev)}
                >
                  <img
                    src="/notification.png"
                    alt="Notification"
                    className="h-5 w-5"
                  />
                  <span className="absolute -top-1 -right-0.5 bg-[#F97316] h-2 w-2 rounded-full" />
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 appearance-none border-0 bg-transparent px-2 py-1 text-gray-700 outline-none text-sm font-medium"
              >
                <span className="text-base">{lang === "EN" ? "🇺🇸" : "🇧🇩"}</span>
                <span>{lang}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                  {[
                    { code: "EN", label: "English", flag: "🇺🇸" },
                    { code: "BN", label: "বাংলা", flag: "🇧🇩" },
                  ].map((langItem) => (
                    <button
                      type="button"
                      key={langItem.code}
                      onClick={() => handleLanguageChange(langItem.code)}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 border-b last:border-b-0 border-gray-50 ${lang === langItem.code
                          ? "bg-gray-50 font-semibold text-[#184EF0]"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-base">{langItem.flag}</span>
                      <span className="text-xs">{langItem.label}</span>
                      {lang === langItem.code && (
                        <span className="ml-auto text-[#F97316]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Action / Login Underline Element */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5"
                >
                  <div className="h-8 w-8 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser?.name?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden lg:inline">
                    {currentUser?.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 flex gap-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      {t("dashboard")}
                    </Link>

                    <Link
                      to="/settings"
                      className="px-4 py-2 flex gap-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      {t("settings")}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 flex gap-3 text-sm text-red-600 w-full hover:bg-red-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="text-sm font-medium text-[#F97316] underline decoration-2 underline-offset-[6px] transition hover:text-[#ea6a0a]"
              >
                Sign in
              </button>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU INTERACTIVE OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 fixed inset-x-0 top-[58px] max-h-[calc(100vh-58px)] overflow-y-auto shadow-lg z-40">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang === "EN" ? "🇺🇸" : "🇧🇩"}</span>
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm font-medium bg-transparent border-none focus:outline-none"
              >
                <option value="EN">English</option>
                <option value="BN">বাংলা</option>
              </select>
            </div>
          </div>

          {[
            { key: "courses", path: "/dashboard", label: t("go_to_courses") },
            { key: "blog", path: "/blog", label: t("blog") },
            {
              key: "plans-pricing",
              path: "/pricing",
              label: t("plans_pricing"),
            },
            { key: "teach", path: "/teach", label: t("teach_on_edunest") },
            {
              key: "my-learning",
              path: "/my-learning",
              label: t("my_learning"),
            },
            ...(currentUser
              ? [
                {
                  key: "dashboard",
                  path: "/dashboard",
                  label: t("dashboard"),
                },
                { key: "settings", path: "/settings", label: t("settings") },
                {
                  key: "logout",
                  path: "#",
                  label: t("logout"),
                  onClick: handleLogout,
                },
              ]
              : [
                {
                  key: "login",
                  path: "#",
                  label: "Login",
                  onClick: handleLoginClick,
                },
              ]),
          ].map((item) =>
            item.onClick ? (
              <button
                key={item.key}
                onClick={() => {
                  item.onClick();
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm border-b border-gray-100 ${item.key === "logout" ? "text-red-600" : "text-[#F97316]"
                  }`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.key}
                to={item.path}
                className="block px-4 py-3 text-sm border-b border-gray-100 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      )}
      <StudentDashboard />
    </header>
  );
}




















































// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   ShoppingCart,
//   Microscope,
//   ChevronDown,
//   Menu,
//   Search,
//   X,
//   User,
//   LogOut,
//   Settings,
// } from "lucide-react";
// import { useAuth } from "@/context/auth-context/AuthContext";
// import { useLang } from "@/context/lang-context";
// import { useStudent } from "@/context/student-context";
// import StudentDashboard from "@/pages/auth/student/home";
// import styled from "styled-components";

// // Styled search bar component with increased width and height
// const StyledSearchBar = styled.div`
//   .input-container {
//     width: 360px;
//     position: relative;
//   }

//   .icon {
//     position: absolute;
//     right: 15px;
//     top: calc(50% + 5px);
//     transform: translateY(calc(-50% - 5px));
//     cursor: pointer;
//     color: #f97316;
//   }

//   .input {
//     width: 100%;
//     height: 40px;
//     padding: 25px 42px 25px 16px;
//     transition: 0.2s linear;
//     border: 1px solid #BADBFF;
//     font-size: 15px;
//     letter-spacing: 0.5px;
//     background: #FAFAFA;
//     border-radius: 3px;
//   }

//   .input:focus {
//     outline: none;
//     border: 1.5px solid #1877d9;
//     box-shadow: -3px -0.2px 0px #1877d9;
//   }

//   .input-container:hover > .icon {
//     animation: anim 1s linear infinite;
//   }

//   @keyframes anim {
//     0%,
//     100% {
//       transform: translateY(calc(-50% - 5px)) scale(1);
//     }

//     50% {
//       transform: translateY(calc(-50% - 5px)) scale(1.1);
//     }
//   }
// `;

// export default function StudentViewCommonLayout() {
//   const { currentUser, logout } = useAuth();
//   const { lang, setLang, t } = useLang();
//   const { cartItems, cartCount, cartTotal, removeCourseFromCart } =
//     useStudent();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showAnnouncement, setShowAnnouncement] = useState(true);
//   const [langOpen, setLangOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [showCartDropdown, setShowCartDropdown] = useState(false);
//   const [showNotificationDropdown, setShowNotificationDropdown] =
//     useState(false);
//   const [isDesktopNavSticky, setIsDesktopNavSticky] = useState(false);
//   const [focusMobileSearchOnOpen, setFocusMobileSearchOnOpen] = useState(false);
//   const [selectedCheckoutCourseIds, setSelectedCheckoutCourseIds] = useState(
//     [],
//   );
//   const cartDropdownRef = useRef(null);
//   const notificationDropdownRef = useRef(null);
//   const mobileSearchInputRef = useRef(null);
//   const notificationMessages = [
//     "Flash Sale: Save 30% on Web Development courses today.",
//     "Limited Offer: Get 20% off when you buy 2+ courses.",
//     "Weekend Deal: Extra 15% discount on AI and ML tracks.",
//   ];

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         showCartDropdown &&
//         !cartDropdownRef.current?.contains(event.target)
//       ) {
//         setShowCartDropdown(false);
//       }
//       if (
//         showNotificationDropdown &&
//         !notificationDropdownRef.current?.contains(event.target)
//       ) {
//         setShowNotificationDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [showCartDropdown, showNotificationDropdown]);

//   useEffect(() => {
//     if (!mobileMenuOpen || !focusMobileSearchOnOpen) return;

//     requestAnimationFrame(() => {
//       mobileSearchInputRef.current?.focus?.();
//     });
//     setFocusMobileSearchOnOpen(false);
//   }, [mobileMenuOpen, focusMobileSearchOnOpen]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsDesktopNavSticky(window.scrollY > 12);
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     setSelectedCheckoutCourseIds((prev) => {
//       const cartIds = new Set(
//         cartItems.map((item) => item?._id).filter(Boolean),
//       );
//       const kept = prev.filter((idValue) => cartIds.has(idValue));
//       if (kept.length > 0) return kept;
//       return Array.from(cartIds);
//     });
//   }, [cartItems]);

//   const formatPrice = (value) => {
//     const numericValue = Number(value);
//     if (!Number.isFinite(numericValue) || numericValue === 0) return "Free";
//     return `$${numericValue.toFixed(2)}`;
//   };

//   function handleLogout() {
//     logout();
//     navigate("/");
//   }

//   function handleLoginClick() {
//     setProfileOpen(false);
//     setMobileMenuOpen(false);
//     navigate("/auth");
//   }

//   // Function to handle language change
//   const handleLanguageChange = (newLang) => {
//     setLang(newLang);
//     setLangOpen(false);
//   };

//   // Handle search submission
//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();
//     if (searchInput.trim()) {
//       sessionStorage.setItem("courseSearchTerm", searchInput.trim());
//       navigate("/dashboard");
//       setSearchInput("");
//       setShowSearchResults(false);
//     }
//   };

//   // Handle search icon click
//   const handleSearchIconClick = () => {
//     handleSearchSubmit();
//   };

//   const handleCheckoutAllClick = () => {
//     const selectedCourses = cartItems.filter((item) =>
//       selectedCheckoutCourseIds.includes(item?._id),
//     );
//     if (selectedCourses.length === 0) return;
//     const firstCourseId = selectedCourses[0]?._id;
//     if (!firstCourseId) return;

//     setShowCartDropdown(false);
//     navigate(`/dashboard/course-details/${firstCourseId}/payment`, {
//       state: {
//         courses: selectedCourses,
//         from: `${location.pathname}${location.search}`,
//       },
//     });
//   };

//   const handleCheckoutSelectionToggle = (courseId) => {
//     if (!courseId) return;
//     setSelectedCheckoutCourseIds((prev) =>
//       prev.includes(courseId)
//         ? prev.filter((idValue) => idValue !== courseId)
//         : [...prev, courseId],
//     );
//   };

//   return (
//     <header className="w-full bg-white font-caveat3 ">
//       {/* ANNOUNCEMENT BAR */}
// 	      {showAnnouncement && !mobileMenuOpen && (
// 	        <div className="bg-[#1877d9] font-semibold text-white -ml-4 text-xs sm:text-[0.92rem] relative">
// 	          <div className="py-2 px-10 sm:px-0">
// 	            <span className="block text-center sm:text-left sm:ml-40 tracking-wider leading-relaxed">
// 	              {t("announcement")}
// 	            </span>
//           </div>
//           <button
//             type="button"
//             onClick={() => setShowAnnouncement(false)}
//             className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 appearance-none border-0 bg-transparent p-1 text-white shadow-none outline-none hover:opacity-80"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       {/* TOP UTIL BAR - Logo, search, cart, language/profile */}
//       <div className="sticky top-0 z-50 border-b border-blue-100 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)] sm:shadow-none">
//         <div className="max-w-7xl mx-auto px-4 py-3 sm:py-2.5 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-1.5 sm:ml-5">
//             <Microscope className="h-7 w-7 text-[#F97316]" />
//             <span className="text-[1.3rem] leading-none font-semibold text-[#1f2937]">
//               Edu
//               <span className="relative top-[0px] text-[#F97316] text-[0.80em] font-semibold">
//                 Nest
//               </span>
//             </span>
//           </Link>

//           {/* Search Bar and Cart - Center aligned */}
//           <div className="flex items-center gap-4 flex-1 justify-center px-5">
//             {/* Search - Larger Styled Search Bar */}
//             <form onSubmit={handleSearchSubmit} className="hidden sm:block">
//               <StyledSearchBar>
//                 <div className="input-container">
//                   <input
//                     type="text"
//                     name="text"
//                     className="input"
//                     placeholder={t("search")}
//                     value={searchInput}
//                     onChange={(e) => {
//                       setSearchInput(e.target.value);
//                       setShowSearchResults(e.target.value.length > 0);
//                     }}
//                   />
//                   <span className="icon" onClick={handleSearchIconClick}>
//                     <svg
//                       width="22px"
//                       height="22px"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <g id="SVGRepo_bgCarrier" strokeWidth={0} />
//                       <g
//                         id="SVGRepo_tracerCarrier"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <g id="SVGRepo_iconCarrier">
//                         <path
//                           opacity={1}
//                           d="M14 5H20"
//                           stroke="#808080"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           opacity={1}
//                           d="M14 8H17"
//                           stroke="#808080"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
//                           stroke="#808080"
//                           strokeWidth="2.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           opacity={1}
//                           d="M22 22L20 20"
//                           stroke="#808080"
//                           strokeWidth="3.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </g>
//                     </svg>
//                   </span>
//                 </div>
//               </StyledSearchBar>

//               {/* Quick search suggestions */}
//               {showSearchResults && searchInput.length > 0 && (
//                 <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-400">
//                   <div className="p-3">
//                     <p className="text-sm text-gray-500 px-2 py-1">
//                       {t("search_press_enter")}{" "}
//                       <span className="font-semibold">{searchInput}</span>
//                     </p>
//                     <div className="border-t mt-2 pt-2">
//                       <p className="text-xs text-gray-400 px-2">
//                         {t("quick_suggestions")}
//                       </p>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           sessionStorage.setItem(
//                             "courseSearchTerm",
//                             "Machine Learning",
//                           );
//                           navigate("/dashboard");
//                           setSearchInput("");
//                           setShowSearchResults(false);
//                         }}
//                         className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
//                       >
//                         <span>🔍</span>
//                         <span>Machine Learning</span>
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           sessionStorage.setItem(
//                             "courseSearchTerm",
//                             "Web Development",
//                           );
//                           navigate("/dashboard");
//                           setSearchInput("");
//                           setShowSearchResults(false);
//                         }}
//                         className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
//                       >
//                         <span>🔍</span>
//                         <span>Web Development</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </form>

//             {/* Desktop Icons */}
//             <div className="hidden sm:flex items-center gap-4">
//               {/* Cart */}
//               <div className="relative" ref={cartDropdownRef}>
//                 <button
//                   type="button"
//                   className="relative"
//                   onClick={() => setShowCartDropdown((prev) => !prev)}
//                   aria-label="Cart"
//                 >
//                   <img
//                     src="/shopping-cart.png"
//                     alt="Cart"
//                     className="h-6 w-6"
//                   />
//                   <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 </button>
//                 {showCartDropdown && (
//                   <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl">
//                     {cartItems.length === 0 ? (
//                       <p className="text-sm text-slate-600">
//                         Your cart is empty.
//                       </p>
//                     ) : (
//                       <>
//                         <div className="max-h-64 space-y-2 overflow-auto pr-1">
//                           {cartItems.map((item) => (
//                             <div
//                               key={item?._id}
//                               className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0"
//                             >
//                               <img
//                                 src={
//                                   item?.image?.url || "/course-placeholder.png"
//                                 }
//                                 alt={item?.title || "Course"}
//                                 className="h-12 w-16 object-cover"
//                               />
//                               <div className="min-w-0 flex-1">
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setShowCartDropdown(false);
//                                     navigate(
//                                       `/dashboard/course-details/${item?._id}`,
//                                     );
//                                   }}
//                                   className="truncate text-left text-sm font-semibold text-slate-800 hover:text-[#184EF0]"
//                                 >
//                                   {item?.title || "Untitled course"}
//                                 </button>
//                                 <p className="text-xs text-slate-500">
//                                   {formatPrice(item?.pricing)}
//                                 </p>
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeCourseFromCart(item?._id)
//                                   }
//                                   className="mt-1 text-xs font-semibold text-red-600 hover:underline"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                               <input
//                                 type="checkbox"
//                                 checked={selectedCheckoutCourseIds.includes(
//                                   item?._id,
//                                 )}
//                                 onChange={() =>
//                                   handleCheckoutSelectionToggle(item?._id)
//                                 }
//                                 className="h-4 w-4 shrink-0 accent-[#184EF0]"
//                                 aria-label={`Select ${item?.title || "course"} for checkout`}
//                               />
//                             </div>
//                           ))}
//                         </div>
//                         <div className="mt-3 border-t border-slate-200 pt-2 text-sm font-semibold text-slate-700">
//                           Total: {formatPrice(cartTotal)}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={handleCheckoutAllClick}
//                           disabled={selectedCheckoutCourseIds.length === 0}
//                           className={`mt-3 inline-flex h-9 w-full items-center justify-center px-3 text-sm font-semibold text-white ${
//                             selectedCheckoutCourseIds.length === 0
//                               ? "cursor-not-allowed bg-slate-400"
//                               : "bg-[#184EF0] hover:bg-[#123fd0]"
//                           }`}
//                         >
//                           Checkout Selected ({selectedCheckoutCourseIds.length})
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Notification */}
//               <div className="relative" ref={notificationDropdownRef}>
//                 <button
//                   type="button"
//                   className="relative"
//                   onClick={() => setShowNotificationDropdown((prev) => !prev)}
//                 >
//                   <img
//                     src="/notification.png"
//                     alt="Notification"
//                     className="h-6 w-6"
//                   />
//                   <span className="absolute -top-1 -right-0 bg-[#F97316] h-2.5 w-2.5 rounded-full" />
//                 </button>
//                 {showNotificationDropdown && (
//                   <div className="absolute right-0 top-10 z-50 w-[320px] border border-slate-200 bg-white p-3 shadow-xl">
//                     <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#184EF0]">
//                       Discount Alerts
//                     </p>
//                     <div className="space-y-2">
//                       {notificationMessages.map((message, index) => (
//                         <p
//                           key={`${message}-${index}`}
//                           className="border-b border-slate-100 pb-2 text-xs text-slate-700 last:border-b-0 last:pb-0"
//                         >
//                           {message}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

// 	            {/* Mobile Icons - Positioned lower with padding */}
// 	            <div className="flex sm:hidden items-center gap-4 mt-2">
// 	              {/* Mobile Cart */}
// 	              <div className="relative" ref={cartDropdownRef}>
//                 <button
//                   type="button"
//                   className="relative"
//                   onClick={() => setShowCartDropdown((prev) => !prev)}
//                   aria-label="Cart"
//                 >
//                   <img
//                     src="/shopping-cart.png"
//                     alt="Cart"
//                     className="h-5 w-5"
//                   />
//                   <span className="absolute -top-1.5 -right-1.5 bg-[#F97316] text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
//                     {cartCount}
//                   </span>
// 	                </button>
// 	              </div>

// 	              {/* Mobile Notification */}
// 	              <div className="relative" ref={notificationDropdownRef}>
// 	                <button
// 	                  type="button"
//                   className="relative"
//                   onClick={() => setShowNotificationDropdown((prev) => !prev)}
//                 >
//                   <img
//                     src="/notification.png"
//                     alt="Notification"
//                     className="h-5 w-5"
//                   />
//                   <span className="absolute -top-1 -right-0.5 bg-[#F97316] h-2 w-2 rounded-full" />
// 	                </button>
// 	              </div>

// 	              {/* Mobile Search (opens hamburger menu) */}
// 	              <button
// 	                type="button"
// 	                aria-label="Search"
// 	                onClick={() => {
// 	                  setShowCartDropdown(false);
// 	                  setShowNotificationDropdown(false);
// 	                  setFocusMobileSearchOnOpen(true);
// 	                  setMobileMenuOpen(true);
// 	                }}
// 	              >
// 	                <Search className="h-5 w-5 text-slate-800 mb-2" />
// 	              </button>
// 	            </div>

//             {/* Wishlist (commented out) */}
//             {/* <button className="relative">
//                <img
//                 src="/love.png"
//                 alt="Cart"
//                 className="h-6 w-6"
//               />
//               <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
//                 0
//               </span>
//             </button> */}
//           </div>

//           {/* RIGHT CONTROLS - Language and Profile */}
//           <div className="flex items-center gap-4">
//             {/* Language Dropdown */}
//             <div className="relative hidden sm:block">
//               <button
//                 type="button"
//                 onClick={() => setLangOpen(!langOpen)}
//                 className="flex items-center gap-2 appearance-none border-0 bg-transparent px-3 py-1.5 text-gray-900 shadow-none outline-none"
//               >
//                 <span className="text-lg">{lang === "EN" ? "🇺🇸" : "🇧🇩"}</span>
//                 <span className="text-xs font-medium">{lang}</span>
//                 <ChevronDown className="h-4 w-4 text-gray-500" />
//               </button>

//               {langOpen && (
//                 <div
//                   className="absolute right-0 mt-2 w-36 bg-white
//             border border-gray-200 border-b-2 border-b-gray-300
//             rounded-xl shadow-lg shadow-black/10 z-50
//             animate-in fade-in slide-in-from-top-2"
//                 >
//                   {[
//                     { code: "EN", label: "English", flag: "🇺🇸" },
//                     { code: "BN", label: "বাংলা", flag: "🇧🇩" },
//                   ].map((langItem) => (
//                     <button
//                       type="button"
//                       key={langItem.code}
//                       onClick={() => handleLanguageChange(langItem.code)}
//                       className={`relative group flex items-center gap-3 w-full px-4 py-2.5
//                 text-sm text-gray-700 transition border-b last:border-b-0 border-blue-100
//                 ${lang === langItem.code ? "bg-transparent text-[#184EF0]" : "bg-white hover:bg-white"}`}
//                     >
//                       <span className="text-lg">{langItem.flag}</span>
//                       <div className="flex flex-col text-left">
//                         <span className="font-medium">{langItem.code}</span>
//                         <span className="text-xs text-gray-500">
//                           {langItem.label}
//                         </span>
//                       </div>
//                       {lang === langItem.code && (
//                         <span className="ml-auto text-[#F97316]">✓</span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Divider */}
//             <span className="h-7 w-px bg-[#F97316]/30 hidden sm:block" />

//             {/* Profile / Login */}
//             {currentUser ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center gap-1.5"
//                 >
//                   <div className="h-9 w-9 rounded-full bg-[#F97316] text-white flex items-center justify-center text-sm font-semibold">
//                     {currentUser?.name?.charAt(0)}
//                   </div>
//                   <span className="text-sm text-gray-700 font-medium hidden lg:inline">
//                     {currentUser?.name}
//                   </span>
//                   <ChevronDown className="h-3 w-3 text-gray-500 hidden sm:block" />
//                 </button>

//                 {profileOpen && (
//                   <div
//                     className="absolute right-0 mt-2 w-48 bg-white
//               border border-gray-200 border-b-2 border-b-[#F97316]/60
//               rounded-xl shadow-lg shadow-black/10 z-50
//               animate-in fade-in slide-in-from-top-2"
//                   >
//                     <Link
//                       to="/dashboard"
//                       className="px-4 py-2.5 flex gap-3 text-sm hover:bg-gray-50"
//                     >
//                       <User className="h-4 w-4 text-gray-500" />
//                       {t("dashboard")}
//                     </Link>

//                     <Link
//                       to="/settings"
//                       className="px-4 py-2.5 flex gap-3 text-sm hover:bg-gray-50"
//                     >
//                       <Settings className="h-4 w-4 text-gray-500" />
//                       {t("settings")}
//                     </Link>

//                     <button
//                       onClick={handleLogout}
//                       className="px-4 py-2.5 flex gap-3 text-sm text-red-600 w-full hover:bg-red-50"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       {t("logout")}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={handleLoginClick}
//                 className="rounded-lg bg-[#F97316] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ea6a0a]"
//               >
//                 Login
//               </button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="sm:hidden"
//             >
//               {mobileMenuOpen ? (
//                 <X className="h-5 w-5" />
//               ) : (
//                 <Menu className="h-5 w-5" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN NAVIGATION BAR - Desktop only */}
//       <div className="hidden md:block sticky top-[58px] z-40 border-b border-gray-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
//         <div
//           className={`max-w-7xl mx-auto px-4 flex transition-all duration-200 ${
//             isDesktopNavSticky ? "h-16 items-center" : "h-14 items-center"
//           }`}
//         >
//           {/* Desktop Navigation - All links in one row */}
//           <nav
//             className={`flex gap-12 text-sm font-normal text-black tracking-[0.08em] transition-all duration-200 ${
//               isDesktopNavSticky ? "items-center translate-y-2" : "items-center"
//             }`}
//           >
//             {/* Main Navigation */}
//             <Link
//               to="/dashboard"
//               className="relative group mr-26 -right-26 text-[1rem] font-normal text-[#36454F] tracking-[0.0em] transition-colors duration-300 hover:text-black"
//             >
//               {t("go_to_courses")}
//               {/* Curve underline */}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>

//             <Link
//               to="/blog"
//               className="relative group text-[1rem] font-medium text-[#36454F] tracking-[0.08em] transition-colors duration-300 hover:text-black"
//             >
//               {t("blog")}
//               {/* Curve underline */}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>

//             <Link
//               to="/dashboard"
//               className="relative group text-[1rem] font-normal text-[#36454F] tracking-[0.08em] transition-colors duration-300 hover:text-black"
//             >
//               {t("dashboard")}
//               {/* Curve underline */}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>

//             {/* Divider */}
//             <span className="h-6 w-px bg-gray-300" />

//             {/* Additional Navigation Links */}
//             <Link
//               to="/pricing"
//               className="relative group text-[1rem] font-normal text-[#36454F] tracking-[0.08em] transition-colors duration-300 hover:text-black"
//             >
//               {t("plans_pricing")}
//               {/* Curve underline */}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>

//             <Link
//               to="/teach"
//               className="relative group text-[1rem] font-normal text-black/80 tracking-[0.08em] transition-colors duration-300 hover:text-black"
//             >
//               {t("teach_on_edunest")}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>

//             <Link
//               to="/my-learning"
//               className="relative group text-[1rem] font-base text-black/80 tracking-[0.08em] transition-colors duration-300 hover:text-black"
//             >
//               {t("my_learning")}
//               <svg
//                 className="absolute -bottom-2 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 width="50"
//                 height="12"
//                 viewBox="0 0 50 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0,6 C10,2 20,10 25,6 C30,2 40,10 50,6"
//                   stroke="#F97316"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   fill="none"
//                 />
//               </svg>
//             </Link>
//           </nav>
//         </div>
//       </div>

// 	      {/* Mobile Navigation Menu - Hamburger Menu Only */}
// 	      {mobileMenuOpen && (
// 	        <div className="md:hidden bg-white border-t border-gray-300 fixed inset-x-0 top-[58px] max-h-[calc(100vh-58px)] overflow-y-auto shadow-lg z-40">
// 	          {/* Mobile Search */}
// 	          <form
// 	            onSubmit={handleSearchSubmit}
// 	            className="p-4 border-b border-gray-300"
// 	          >
// 	            <StyledSearchBar>
// 	              <div className="input-container !w-full max-w-full">
// 	                <input
// 	                  ref={mobileSearchInputRef}
// 	                  type="text"
// 	                  name="text"
// 	                  className="input"
// 	                  placeholder={t("search")}
// 	                  value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                 />
//                 <span className="icon" onClick={handleSearchIconClick}>
//                   <svg
//                     width="22px"
//                     height="22px"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <g id="SVGRepo_bgCarrier" strokeWidth={0} />
//                     <g
//                       id="SVGRepo_tracerCarrier"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <g id="SVGRepo_iconCarrier">
//                       <path
//                         opacity={1}
//                         d="M14 5H20"
//                         stroke="#F97316"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         opacity={1}
//                         d="M14 8H17"
//                         stroke="#000"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
//                         stroke="#000"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         opacity={1}
//                         d="M22 22L20 20"
//                         stroke="#000"
//                         strokeWidth="3.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </g>
//                   </svg>
//                 </span>
//               </div>
//             </StyledSearchBar>
//           </form>

//           {/* Mobile Language Selector */}
//           <div className="px-4 py-3 border-b border-gray-300">
//             <div className="flex items-center gap-2">
//               <span className="text-lg">{lang === "EN" ? "🇺🇸" : "🇧🇩"}</span>
//               <select
//                 value={lang}
//                 onChange={(e) => handleLanguageChange(e.target.value)}
//                 className="text-sm font-medium bg-transparent border-none focus:outline-none"
//               >
//                 <option value="EN">English</option>
//                 <option value="BN">বাংলা</option>
//               </select>
//             </div>
//           </div>

//           {/* All Navigation Links in Mobile */}
//           {[
//             { key: "courses", path: "/dashboard", label: t("go_to_courses") },
//             { key: "blog", path: "/blog", label: t("blog") },
//             {
//               key: "plans-pricing",
//               path: "/pricing",
//               label: t("plans_pricing"),
//             },
//             { key: "teach", path: "/teach", label: t("teach_on_edunest") },
//             {
//               key: "my-learning",
//               path: "/my-learning",
//               label: t("my_learning"),
//             },
//             ...(currentUser
//               ? [
//                   {
//                     key: "dashboard",
//                     path: "/dashboard",
//                     label: t("dashboard"),
//                   },
//                   { key: "settings", path: "/settings", label: t("settings") },
//                   {
//                     key: "logout",
//                     path: "#",
//                     label: t("logout"),
//                     onClick: handleLogout,
//                   },
//                 ]
//               : [
//                   {
//                     key: "login",
//                     path: "#",
//                     label: "Login",
//                     onClick: handleLoginClick,
//                   },
//                 ]),
//           ].map((item) =>
//             item.onClick ? (
//               <button
//                 key={item.key}
//                 onClick={() => {
//                   item.onClick();
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`block w-full text-left px-4 py-3 text-sm border-b border-gray-300 ${
//                   item.key === "logout" ? "text-red-600" : "text-[#F97316]"
//                 }`}
//               >
//                 {item.label}
//               </button>
//             ) : (
//               <Link
//                 key={item.key}
//                 to={item.path}
//                 className="block px-4 py-3 text-sm border-b border-gray-300"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             ),
//           )}
//         </div>
//       )}
//       <StudentDashboard />
//     </header>
//   );
// }
