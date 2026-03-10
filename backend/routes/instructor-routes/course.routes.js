// // routes/instructor-routes/course.routes.js

// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../../middleware/auth");


// const {
//   addNewCourse,
//   createCourse,
//   getNewCourse,
//   updateCourseByID,
//   getInstructorCourse,
//   getCourseDetails,
//   getAllCourses,
//   deleteCourse,
//   togglePublishCourse,
//   getInstructorCourses,
// } = require("../../controller/instructor-controller/course.controller");

// /* 
//    INSTRUCTOR ROUTES (AUTH REQUIRED)
//    Base URL: /api/instructor/courses
//  */

// /* CREATE COURSE */
// router.post("/", authMiddleware, createCourse);
// // 🔥 INSTRUCTOR DASHBOARD — MUST be before "/" route
// router.get("/", authMiddleware, getInstructorCourses);


// /* OPTIONAL ALIAS (if frontend calls /add) */
// router.post("/add", authMiddleware, addNewCourse);

// /* GET SINGLE COURSE (INSTRUCTOR – FULL DATA) */
// router.get("/instructor/:courseId", authMiddleware, getInstructorCourse);

// /* OPTIONAL ALIAS */
// router.get("/new/:courseId", authMiddleware, getNewCourse);

// /* UPDATE COURSE */
// router.put("/:courseId", authMiddleware, updateCourseByID);

// /* DELETE COURSE */
// router.delete("/:courseId", authMiddleware, deleteCourse);

// /* PUBLISH / UNPUBLISH COURSE */
// router.patch("/:courseId/publish", authMiddleware, togglePublishCourse);

// /* 
//    PUBLIC / STUDENT ROUTES (NO AUTH)
//    Base URL: /api/courses
//  */

// /* GET COURSE DETAILS (PUBLISHED ONLY) */
// router.get("/details/:courseId", getCourseDetails);

// /* GET ALL PUBLISHED COURSES */
// router.get("/", getAllCourses);

// module.exports = router;







// routes/instructor-routes/course.routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const {
  addNewCourse,
  createCourse,
  getNewCourse,
  updateCourseByID,
  getInstructorCourse,
  getCourseDetails,
  getAllCourses,
  deleteCourse,
  togglePublishCourse,
  getInstructorCourses,
} = require("../../controller/instructor-controller/course.controller");

/* INSTRUCTOR ROUTES (AUTH REQUIRED)
   Base URL: /api/instructor/courses */

/* CREATE COURSE */
router.post("/", authMiddleware, createCourse);

/* GET ALL COURSES (Instructor Dashboard) */
router.get("/", authMiddleware, getInstructorCourses);

/* OPTIONAL ALIAS */
router.post("/add", authMiddleware, addNewCourse);

/* GET SINGLE COURSE (Instructor) */
router.get("/instructor/:courseId", authMiddleware, getInstructorCourse);

/* OPTIONAL ALIAS */
router.get("/new/:courseId", authMiddleware, getNewCourse);

/* UPDATE COURSE */
router.put("/:courseId", authMiddleware, updateCourseByID);

/* DELETE COURSE */
router.delete("/:courseId", authMiddleware, deleteCourse);

/* PUBLISH / UNPUBLISH */
router.patch("/:courseId/publish", authMiddleware, togglePublishCourse);

/* 
   PUBLIC / STUDENT ROUTES
   Base URL: /api/courses
 */

/* GET COURSE DETAILS */
router.get("/public/details/:courseId", getCourseDetails);

/* GET ALL PUBLISHED COURSES */
router.get("/public", getAllCourses);

module.exports = router;


// // router.post("/add" , addNewCourse);
// // router.get("/get" , getAllCourses);
// // router.get("/get/details/:id" , getCourseDetails);
// // router.put("/update/:id" , updateCourseByID);