// const cloudinary = require("cloudinary").v2;

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Upload media (image/video)
// const uploadMediaToCloudinary = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto", // supports video & image
//       folder: "course-master/lectures",
//     });

//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//       resource_type: result.resource_type,
//     };
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     throw new Error("Error uploading to Cloudinary");
//   }
// };

// // Delete image / video
// const deleteMediaFromCloudinary = async (
//   publicId,
//   resourceType = "video"
// ) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: resourceType, // MUST be "video" for videos
//     });

//     return result;
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw new Error("Error deleting from Cloudinary");
//   }
// };

// module.exports = {
//   cloudinary,
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// };




// helpers/cloudinary.js

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
    folder: "course-master/lectures",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
  };
};

const deleteMediaFromCloudinary = async (
  publicId,
  resourceType = "video"
) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

module.exports = {
  cloudinary,
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
};
