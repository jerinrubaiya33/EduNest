//  addNewCourse
//  getNewCourse
//  createCourse
//  updateCourse
//  getInstructorCourse
//  getCourseDetails (public/student)
//  getAllPublishedCourses
//  deleteCourse
//  togglePublishCourse


//backend/controller/course.controller.js
const Course = require("../../models/Course");

/* CREATE COURSE */
exports.addNewCourse = async (req, res) => {
  return exports.createCourse(req, res);
};

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      detailedDescription,
      objective,
      welcomeMessage,
      category,
      level,
      language,
      pricing,
      image,
      curriculum,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !language ||
      !Array.isArray(curriculum) ||
      curriculum.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    for (let i = 0; i < curriculum.length; i++) {
      const lecture = curriculum[i];

      if (!lecture.title || !lecture.videoUrl || !lecture.public_id) {
        return res.status(400).json({
          success: false,
          message: `Lecture ${i + 1} is incomplete`,
        });
      }
    }

    const course = await Course.create({
      instructor: req.user._id,
      title,
      subtitle,
      description,
      detailedDescription,
      objective,
      welcomeMessage,
      category,
      level,
      language,
      pricing,
      image,
      curriculum,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/*  GET INSTRUCTOR DASHBOARD COURSES
    - includes curriculum */
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    })
      .select(
        "title subtitle category level pricing image curriculum isPublished createdAt"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error("Get instructor courses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* GET SINGLE COURSE (INSTRUCTOR) */
exports.getNewCourse = async (req, res) => {
  return exports.getInstructorCourse(req, res);
};

exports.getInstructorCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate(
      "instructor",
      "name email"
    );

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.instructor._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, course });
  } catch (err) {
    console.error("Get instructor course error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* UPDATE COURSE */
exports.updateCourseByID = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateCourseData = req.body;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    Object.assign(course, updateCourseData);
    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* DELETE COURSE */
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await course.deleteOne();

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* PUBLIC — COURSE DETAILS */
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      isPublished: true,
    })
      .populate("instructor", "name email")
      .lean();

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    course.curriculum = course.curriculum.map((lecture) => {
      if (!lecture.freePreview) {
        return {
          title: lecture.title,
          freePreview: false,
          videoUrl: null,
        };
      }
      return lecture;
    });

    res.json({ success: true, course });
  } catch (err) {
    console.error("Get course details error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* PUBLIC — ALL COURSES */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("title subtitle category level pricing image instructor createdAt")
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: courses });
  } catch (err) {
    console.error("Get all courses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* PUBLISH / UNPUBLISH */
exports.togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      success: true,
      isPublished: course.isPublished,
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      } successfully`,
    });
  } catch (err) {
    console.error("Publish course error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};