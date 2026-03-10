//models/Course.js I used
const mongoose = require("mongoose");

/* LECTURE SCHEMA */
const LectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    videoName: {
      type: String,
    },

    public_id: {
      type: String, // Cloudinary public_id
      required: true,
    },

    freePreview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/* STUDENT SUB-SCHEMA */
const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* COURSE SCHEMA */
const CourseSchema = new mongoose.Schema(
  {
    /* INSTRUCTOR */
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* LANDING PAGE DATA */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    description: {
      // SHORT DESCRIPTION
      type: String,
      required: true,
    },

    detailedDescription: {
      type: String,
    },

    objective: {
      type: String,
    },

    welcomeMessage: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    language: {
      type: String,
      required: true,
    },

    pricing: {
      type: Number,
      default: 0,
    },

    /* COURSE IMAGE */
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },

    /* CURRICULUM */
    curriculum: {
      type: [LectureSchema],
      validate: [
        (v) => v.length > 0,
        "Course must have at least one lecture",
      ],
    },

    /* ENROLLED STUDENTS */
    students: {
      type: [StudentSchema],
      default: [],
      paidAmount: String
    },

    /* STATUS */
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", CourseSchema);