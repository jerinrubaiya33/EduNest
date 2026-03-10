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



// const mongoose = require("mongoose");

// /* LECTURE SCHEMA */
// const LectureSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     videoUrl: {
//       type: String,
//       required: true,
//     },

//     videoName: {
//       type: String,
//     },

//     public_id: {
//       type: String, // Cloudinary public_id
//       required: true,
//     },

//     freePreview: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { _id: false }
// );

// /* STUDENT ENROLLMENT SCHEMA */
// const StudentEnrollmentSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     enrolledAt: {
//       type: Date,
//       default: Date.now,
//     },

//     progress: {
//       // Track which lectures the student has completed
//       completedLectures: [
//         {
//           lectureIndex: Number, // Index of the lecture in curriculum array
//           completedAt: Date,
//         }
//       ],

//       lastAccessed: {
//         type: Date,
//         default: Date.now,
//       },

//       completionPercentage: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100,
//       },
//     },

//     paymentDetails: {
//       orderId: String,
//       paymentId: String,
//       amount: Number,
//       currency: {
//         type: String,
//         default: "USD",
//       },
//       paymentDate: Date,
//       paymentStatus: {
//         type: String,
//         enum: ["pending", "completed", "failed", "refunded"],
//         default: "pending",
//       },
//     },

//     // For free courses or promotional enrollments
//     enrollmentType: {
//       type: String,
//       enum: ["paid", "free", "promotional"],
//       default: "paid",
//     },
//   },
//   { _id: true }
// );

// /* COURSE SCHEMA */
// const CourseSchema = new mongoose.Schema(
//   {
//     /* INSTRUCTOR */
//     instructor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     /* LANDING PAGE DATA */
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     subtitle: {
//       type: String,
//       trim: true,
//     },

//     description: {
//       // SHORT DESCRIPTION
//       type: String,
//       required: true,
//     },

//     detailedDescription: {
//       type: String,
//     },

//     objective: {
//       type: String,
//     },

//     welcomeMessage: {
//       type: String,
//     },

//     category: {
//       type: String,
//       required: true,
//     },

//     level: {
//       type: String,
//       enum: ["beginner", "intermediate", "advanced"],
//       default: "beginner",
//     },

//     language: {
//       type: String,
//       required: true,
//     },

//     pricing: {
//       type: Number,
//       default: 0,
//     },

//     /* COURSE IMAGE */
//     image: {
//       url: {
//         type: String,
//       },
//       public_id: {
//         type: String,
//       },
//     },

//     /* CURRICULUM */
//     curriculum: {
//       type: [LectureSchema],
//       validate: [
//         (v) => v.length > 0,
//         "Course must have at least one lecture",
//       ],
//     },

//     /* STUDENTS ENROLLED */
//     enrolledStudents: [StudentEnrollmentSchema],

//     /* STATISTICS (optional, can be computed) */
//     stats: {
//       totalEnrollments: {
//         type: Number,
//         default: 0,
//       },
//       averageRating: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       totalRatings: {
//         type: Number,
//         default: 0,
//       },
//       totalCompletionRate: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100,
//       },
//     },

//     /* REVIEWS (could also be in separate collection) */
//     reviews: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         rating: {
//           type: Number,
//           min: 1,
//           max: 5,
//         },
//         comment: String,
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       }
//     ],

//     /* STATUS */
//     isPublished: {
//       type: Boolean,
//       default: false,
//     },

//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },

//     /* METADATA */
//     tags: [String],
    
//     prerequisites: [String],
    
//     whatYouWillLearn: [String],

//     requirements: [String],
//   },
//   {
//     timestamps: true,
//   }
// );

// // Virtual for getting total lectures count
// CourseSchema.virtual("totalLectures").get(function() {
//   return this.curriculum.length;
// });

// // Virtual for getting total video duration (you might want to add duration field to LectureSchema)
// // CourseSchema.virtual("totalDuration").get(function() {
// //   return this.curriculum.reduce((total, lecture) => total + (lecture.duration || 0), 0);
// // });

// // Middleware to update totalEnrollments when students are added/removed
// CourseSchema.pre("save", function(next) {
//   if (this.enrolledStudents) {
//     this.stats.totalEnrollments = this.enrolledStudents.length;
//   }
//   next();
// });

// // Index for better query performance
// CourseSchema.index({ instructor: 1 });
// CourseSchema.index({ category: 1 });
// CourseSchema.index({ level: 1 });
// CourseSchema.index({ "enrolledStudents.student": 1 });
// CourseSchema.index({ isPublished: 1, isFeatured: 1 });

// module.exports = mongoose.model("Course", CourseSchema);