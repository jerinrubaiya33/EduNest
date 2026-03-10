//getAllStudentViewCourses = getAllPublishedCourses
//getStudentViewCoursesDetails = getCourseDetailsForStudent


const express = require("express");
const router = express.Router();

const {
  getAllPublishedCourses,
  getCoursesByCategory,
  getCourseDetailsForStudent,
  searchCourses,
} = require("../../controller/student-controller/course.controller");

/* ================================
   STUDENT COURSE ROUTES
================================ */

/**
 * GET /api/student/courses
 * Get all published courses
 * Optional query params:
 * ?category=&level=&language=
 */
router.get("/", getAllPublishedCourses);

/**
 * GET /api/student/courses/search?q=react
 * Search published courses
 */
router.get("/search", searchCourses);

/**
 * GET /api/student/courses/category/:categoryId
 * Get courses by category
 */
router.get("/category/:categoryId", getCoursesByCategory);

/**
 * GET /api/student/courses/:courseId
 * Get single course details (student-safe view)
 */
router.get("/:courseId", getCourseDetailsForStudent);

module.exports = router;