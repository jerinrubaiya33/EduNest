const mongoose = require("mongoose");

const StudentCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    courses: {
      type: [StudentCourseSchema],
      default: [],
      validate: {
        validator(value) {
          const uniqueCourseIds = new Set(value.map((item) => String(item.courseId)));
          return uniqueCourseIds.size === value.length;
        },
        message: "Duplicate courseId is not allowed for the same student.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
