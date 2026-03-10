import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CreditCard, GraduationCap, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useLang } from "@/context/lang-context";

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

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getCourseDiscountPercent(course) {
  const candidates = [
    course?.discountPercent,
    course?.discountPercentage,
    course?.discount,
    course?.offerPercent,
  ];

  for (const value of candidates) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.max(0, Math.min(numeric, 100));
    }
  }

  return 0;
}

function normalizeCourseItem(course) {
  return {
    _id: course?._id || course?.id || "",
    title: course?.title || "Selected Course",
    image: course?.image?.url || "/course-placeholder.png",
    originalPrice: toNumber(course?.pricing),
    discountPercent: getCourseDiscountPercent(course),
  };
}

export default function CoursePaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useLang();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [formValues, setFormValues] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    country: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const notificationDropdownRef = useRef(null);
  const notificationMessages = [
    "Flash Sale: Save 30% on Web Development courses today.",
    "Limited Offer: Get 20% off when you buy 2+ courses.",
    "Weekend Deal: Extra 15% discount on AI and ML tracks.",
  ];

  const coursesFromState = Array.isArray(location.state?.courses)
    ? location.state.courses
    : [];
  const singleCourseFromState = location.state?.course ? [location.state.course] : [];
  const selectedCourses = coursesFromState.length > 0
    ? coursesFromState
    : singleCourseFromState;

  const orderItems = useMemo(() => {
    const uniqueById = new Map();
    selectedCourses.forEach((course) => {
      const normalized = normalizeCourseItem(course);
      if (!normalized._id) return;
      if (!uniqueById.has(normalized._id)) {
        uniqueById.set(normalized._id, normalized);
      }
    });
    return Array.from(uniqueById.values());
  }, [selectedCourses]);

  const subtotal = orderItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const discount = orderItems.reduce(
    (sum, item) => sum + (item.originalPrice * item.discountPercent) / 100,
    0,
  );
  const total = Math.max(0, subtotal - discount);
  const cartCount = orderItems.length;

  const formatted = useMemo(
    () => ({
      subtotal: `$${subtotal.toFixed(2)}`,
      discount: `$${discount.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
    }),
    [discount, subtotal, total],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showNotificationDropdown &&
        !notificationDropdownRef.current?.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotificationDropdown]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    if (id) {
      navigate(`/dashboard/course-details/${id}`, { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;
    navigate(`/dashboard?q=${encodeURIComponent(query)}`);
  };

  const handleSearchIconClick = () => {
    handleSearchSubmit();
  };

  const validate = () => {
    const nextErrors = {};

    const cardDigits = formValues.cardNumber.replace(/\D/g, "");
    if (!cardDigits) {
      nextErrors.cardNumber = "Card number is required.";
    } else if (cardDigits.length !== 16) {
      nextErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!formValues.cardholderName.trim()) {
      nextErrors.cardholderName = "Cardholder name is required.";
    } else if (!/^[A-Za-z ]+$/.test(formValues.cardholderName.trim())) {
      nextErrors.cardholderName = "Cardholder name must contain letters only.";
    }
    if (!formValues.expiryDate.trim()) {
      nextErrors.expiryDate = "Expiry date is required.";
    } else if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formValues.expiryDate)) {
      nextErrors.expiryDate = "Use MM/YYYY with a valid month (01-12).";
    }
    if (!formValues.cvv.trim()) {
      nextErrors.cvv = "CVC/CVV is required.";
    } else if (!/^\d{4}$/.test(formValues.cvv)) {
      nextErrors.cvv = "CVC/CVV must be 4 digits.";
    }
    if (!formValues.country.trim()) nextErrors.country = "Country is required.";
    else if (!/^[A-Za-z ]+$/.test(formValues.country.trim())) {
      nextErrors.country = "Country must contain letters only.";
    }
    if (!formValues.zipCode.trim()) nextErrors.zipCode = "ZIP code is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field, value) => {
    let nextValue = value;

    if (field === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      nextValue = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    if (field === "expiryDate") {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      if (digits.length <= 2) {
        nextValue = digits;
      } else {
        const monthRaw = digits.slice(0, 2);
        const monthNum = Number(monthRaw);
        const month = String(Math.min(Math.max(monthNum || 1, 1), 12)).padStart(2, "0");
        const year = digits.slice(2, 6);
        nextValue = `${month}/${year}`;
      }
    }

    if (field === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    if (field === "country") {
      nextValue = value.replace(/[^A-Za-z ]/g, "");
    }

    if (field === "cardholderName") {
      nextValue = value.replace(/[^A-Za-z ]/g, "");
    }

    setFormValues((prev) => ({ ...prev, [field]: nextValue }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setToastMessage("The transaction could not be completed. Kindly re-enter your card details as they appear on your card and attempt again.");
    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const getInputClassName = (field) =>
    `h-11 w-full border px-3 text-sm outline-none ${
      errors[field]
        ? "border-red-500 placeholder:text-red-400 focus:border-red-500"
        : "border-slate-300 focus:border-[#184EF0]"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      {toastMessage && (
        <div className="fixed right-26 bottom-8 z-[110] max-w-sm rounded border border-red-200 bg-white px-4 py-4 text-sm font-semibold text-red-700 shadow-lg">
          <div className="flex items-start gap-2">
            <span className="mt-0.5  shrink-0 text-base font-extrabold leading-none text-red-600">!</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
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
                    onChange={(e) => setSearchInput(e.target.value)}
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
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
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
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative" aria-label="Cart">
              <img src="/shopping-cart.png" alt="Cart" className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </button>

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

            <button type="button" className="relative" aria-label="Wishlist">
              <img src="/love.png" alt="Wishlist" className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mt-1 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7 border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#184EF0]">
                Payment
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#1c1d1f]">Pay with Debit Card</h1>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Card Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={formValues.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  className={getInputClassName("cardNumber")}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Alexa"
                  value={formValues.cardholderName}
                  onChange={(e) => handleChange("cardholderName", e.target.value)}
                  className={getInputClassName("cardholderName")}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-xs text-red-600">{errors.cardholderName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Expiry Date</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YYYY"
                    value={formValues.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    className={getInputClassName("expiryDate")}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">CVC/CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234"
                    value={formValues.cvv}
                    onChange={(e) => handleChange("cvv", e.target.value)}
                    className={getInputClassName("cvv")}
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Country</label>
                  <input
                    type="text"
                    placeholder="Bangladesh"
                    value={formValues.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className={getInputClassName("country")}
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="1207"
                    value={formValues.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    className={getInputClassName("zipCode")}
                  />
                  {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={orderItems.length === 0}
                className={`mt-2 inline-flex h-11 w-full items-center justify-center gap-2 px-4 text-sm font-bold text-white ${
                  orderItems.length === 0
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-[#184EF0] hover:bg-[#123fd0]"
                }`}
              >
                <CreditCard size={16} />
                {orderItems.length === 0 ? "No Course Selected" : `Pay ${formatted.total}`}
              </button>

              <p className="inline-flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} />
                Your debit card details are encrypted and secure.
              </p>
            </form>
          </section>

          <aside className="lg:col-span-5 border border-slate-200 bg-white p-5 sm:p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-[#1c1d1f]">Order Summary</h2>

            <div className="mt-4 max-h-[290px] space-y-3 overflow-auto border-b border-slate-200 pb-4">
              {orderItems.length === 0 ? (
                <p className="text-sm text-slate-600">No course selected for checkout.</p>
              ) : (
                orderItems.map((item) => {
                  const itemDiscountAmount = (item.originalPrice * item.discountPercent) / 100;
                  const itemTotal = item.originalPrice - itemDiscountAmount;
                  return (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-28 rounded-sm object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">1 x Course License</p>
                        <p className="mt-2 text-sm font-bold text-[#1c1d1f]">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatted.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Discount</span>
                <span>-{formatted.discount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatted.total}</span>
              </div>
            </div>

            <div className="mt-4 rounded-sm border border-[#184EF0]/20 bg-[#f4f8ff] px-3 py-2 text-xs text-slate-700">
              Need help? Contact support before completing payment.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
