//frontend/src/component/pages/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/auth-context/AuthContext";
import RouteGuard from "./components/route-guard";
import AuthPage from "./pages/auth";
import InstructorDashboard from "./pages/auth/instructor";
import StudentDashboard from "./pages/auth/student/home";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import NotFound from "./pages/not-found";
import Analytics from "./pages/auth/instructor/Analytics";
import ManageCourses from "./pages/auth/instructor/Courses";
import Students from "./pages/auth/instructor/Students";
import Earnings from "./pages/auth/instructor/Earnings";
import CreateCourse from "./pages/auth/instructor/CreateCourse";
import EditCourse from "./pages/auth/instructor/EditCourse";
import Dashboard from "./pages/auth/student/student-dashboard";
import CourseDetailsPage from "./pages/auth/student/course-details";
import CoursePaymentPage from "./pages/auth/student/course-details/payment";
import MyLearningPage from "./pages/auth/student/my-learning";

function App() {
  const { currentUser } = useAuth();
  const authenticated = !!currentUser;

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/auth/*"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />
      <Route
        path="/instructor/*"
        element={
          <RouteGuard
            element={<InstructorDashboard />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      >
        <Route path="courses" element={<ManageCourses />} />
        <Route path="students" element={<Students />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="create-course" element={<CreateCourse />} />
        {/* For Edit Course */}
        <Route path="edit-course/:id" element={<EditCourse />} /> 
      </Route>


      {/* Student */}
      {/* <Route
        path="/dashboard"
        element={
          <RouteGuard
            element={<StudentDashboard />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      /> */}
      <Route
        path="/dashboard"
        element={
          <RouteGuard
            element={<Dashboard />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />
      <Route
        path="/dashboard/course-details/:id"
        element={
          <RouteGuard
            element={<CourseDetailsPage />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />
      <Route
        path="/dashboard/course-details/:id/payment"
        element={
          <RouteGuard
            element={<CoursePaymentPage />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />
      <Route
        path="/my-learning"
        element={
          <RouteGuard
            element={<MyLearningPage />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />

      {/* Public Home */}
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={authenticated}
            user={currentUser}
          />
        }
      />

      {/* 404 — LAST ROUTE ALWAYS */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
