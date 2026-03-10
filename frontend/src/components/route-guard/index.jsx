//frontend/components/route-guard/index.jsx
import { useAuth } from "@/context/auth-context/AuthContext";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname;
  const isAuthPage = path.startsWith("/auth");
  const isPublicHome = path === "/";
  const isPublicDashboard = path === "/dashboard";
  const isPublicCourseDetails =
    path.startsWith("/dashboard/course-details/") && !path.endsWith("/payment");
  const isPublicMyLearning = path === "/my-learning";

  const { authLoading } = useAuth(); 

  // Do NOT run redirects until auth state is fully restored
  if (authLoading) {
    return null; 
  }

  // Guests can access `/`, `/dashboard`, `/my-learning`, and `/auth`; protected routes still require login.
  if (!authenticated) {
    if (
      !isAuthPage &&
      !isPublicHome &&
      !isPublicDashboard &&
      !isPublicCourseDetails &&
      !isPublicMyLearning
    ) {
      return <Navigate to="/auth" replace />;
    }
    return element;
  }

  // Logged-in users should NOT visit /auth
  if (isAuthPage) {
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
    if (user.role === "student") return <Navigate to="/" replace />;
    return <Navigate to="/" replace />;
  }

  // Instructor-only pages
  if (path.startsWith("/instructor")) {
    return user.role === "instructor"
      ? element
      : <Navigate to="/dashboard" replace />;
  }

  // Student-only pages except the public course listing at `/dashboard`
  if (path.startsWith("/dashboard") && !isPublicDashboard) {
    return user.role === "student"
      ? element
      : <Navigate to="/instructor" replace />;
  }

  // Public home `/`
  if (isPublicHome) {
    if (user.role === "student") return element;
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
  }

  // Default fallthrough
  return element;
}
