// const express = require("express");
// const multer = require("multer");
// const {
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// } = require("../../helpers/cloudinary");

// const router = express.Router();

// // Multer TEMP storage
// const upload = multer({
//   dest: "uploads/",
//   // limits: {
//   //   fileSize: 500 * 1024 * 1024, // 500MB (videos)
//   // },
// });

// /**
//  * @route   POST /api/instructor/media/upload
//  * @desc    Upload image or video
//  */
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const result = await uploadMediaToCloudinary(req.file.path);

//     res.status(200).json({
//       success: true,
//       data: result, // { url, public_id, resource_type }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// /**
//  * @route   DELETE /api/instructor/media/delete
//  * @desc    Delete image or video
//  */
// router.delete("/delete", async (req, res) => {
//   try {
//     const { public_id, resource_type } = req.body;

//     if (!public_id) {
//       return res.status(400).json({ message: "public_id is required" });
//     }

//     await deleteMediaFromCloudinary(public_id, resource_type || "image");

//     res.status(200).json({
//       success: true,
//       message: "Media deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// module.exports = router;







// routes/instructor-routes/media-routes.jsx
const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Multer TEMP storage
const upload = multer({
  dest: "uploads/",
});

/**
 * @route   POST /api/instructor/media/upload
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadMediaToCloudinary(req.file.path);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/instructor/media/delete
 */
router.delete("/delete", async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required",
      });
    }

    const result = await deleteMediaFromCloudinary(
      public_id,
      resource_type || "video"
    );

    res.status(200).json({
      success: true,
      result,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
