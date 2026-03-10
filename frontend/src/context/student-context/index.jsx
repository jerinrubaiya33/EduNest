// context/student-context/index.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const StudentContext = createContext(null);
const CART_STORAGE_KEY = "eduNestStudentCart";

export default function StudentProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      }
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addCourseToCart = (course) => {
    const courseId = course?._id || course?.id;
    if (!courseId) return false;

    let wasAdded = false;
    setCartItems((prev) => {
      if (prev.some((item) => item?._id === courseId)) return prev;

      wasAdded = true;
      return [
        ...prev,
        {
          _id: courseId,
          title: course?.title || "Untitled course",
          pricing: Number(course?.pricing) || 0,
          image: course?.image || null,
          instructor: course?.instructor || null,
        },
      ];
    });

    return wasAdded;
  };

  const removeCourseFromCart = (courseId) => {
    setCartItems((prev) => prev.filter((item) => item?._id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isCourseInCart = (courseId) => {
    return cartItems.some((item) => item?._id === courseId);
  };

  const cartCount = cartItems.length;
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (Number(item?.pricing) || 0), 0),
    [cartItems],
  );

  return (
    <StudentContext.Provider
      value={{
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
        clearCart,
        isCourseInCart,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

// custom hook (same pattern you’ll use everywhere)
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
};
