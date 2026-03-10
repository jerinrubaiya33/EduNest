//getAllStudentViewCourses = getAllPublishedCourses
//getStudentViewCoursesDetails = getCourseDetailsForStudent


const Course = require("../../models/Course");

/* ================================
   STUDENT — GET ALL PUBLISHED COURSES
   (Optional filters: category, level, language)
================================ */
exports.getAllPublishedCourses = async (req, res) => {
  try {
    const { category, level, language } = req.query;

    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (language) filter.language = language;

    const courses = await Course.find(filter)
      .select(
        "title subtitle description detailedDescription category level pricing image instructor createdAt"
      )
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error("Student get courses error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================
   STUDENT — GET COURSES BY CATEGORY
================================ */
exports.getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const courses = await Course.find({
      category: categoryId,
      isPublished: true,
    })
      .select(
        "title subtitle description detailedDescription category level pricing image instructor createdAt"
      )
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error("Get courses by category error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================
   STUDENT — COURSE DETAILS
   (Protects paid content)
================================ */
exports.getCourseDetailsForStudent = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      isPublished: true,
    })
      .populate("instructor", "name email")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Hide locked lectures
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

    res.json({
      success: true,
      course,
    });
  } catch (err) {
    console.error("Student course details error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================
   STUDENT — SEARCH COURSES
================================ */
exports.searchCourses = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const courses = await Course.find({
      isPublished: true,
      title: { $regex: q, $options: "i" },
    })
      .select(
        "title subtitle description detailedDescription category level pricing image instructor createdAt"
      )
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error("Search courses error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
