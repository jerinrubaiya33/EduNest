// LandingPageTab.jsx
import { useContext, useState, useEffect } from "react";
import api from "@/api/axios";
import {
  courseLandingPageFormControls,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";

export default function LandingPageTab() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
  } = useContext(InstructorContext);

  // PROGRESS STATE for image upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // LOG WHENEVER SHARED STATE CHANGES
  useEffect(() => {
    console.log("📦 [LandingPageTab] courseLandingFormData updated:", courseLandingFormData);
  }, [courseLandingFormData]);

  // Generic input handler for text fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    console.log("✏️ [LandingPageTab] Input change:", {
      field: name,
      value: files ? files[0] : value,
    });

    setCourseLandingFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: files ? files[0] : value,
      };

      console.log("[LandingPageTab] State after update:", updatedData);
      return updatedData;
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      setIsUploading(true);
      setUploadProgress(0);

      const res = await api.post("/api/instructor/media/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      const uploaded = res.data.data || res.data;
      const imageUrl = uploaded.secure_url || uploaded.url;
      const publicId = uploaded.public_id || uploaded.publicId;

      if (!imageUrl) {
        throw new Error("Cloudinary URL missing in response");
      }

      setCourseLandingFormData((prev) => ({
        ...prev,
        image: {
          url: imageUrl,
          public_id: publicId,
        },
      }));

      console.log("Course image uploaded successfully");
    } catch (error) {
      console.error("❌ Image upload failed:", error.response?.data || error.message);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Course Landing Page</h3>

      <p className="text-gray-600 mb-4">
        Add essential course details such as title, description, category, and more.
      </p>

      {/* Course Image Upload Section */}
      <div className="mb-6 p-4 border border-[#184EF0]/25 rounded-none bg-[#f8faff]">
        <label className="block text-black font-medium mb-2">
          Course Image {!courseLandingFormData.image?.url && <span className="text-red-500">*</span>}
        </label>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="
            w-full border border-[#184EF0]/25 rounded-none px-4 py-2 bg-white
            file:bg-[#184EF0] file:text-white file:border-0
            file:px-4 file:py-2 file:rounded-none file:mr-4
            cursor-pointer
          "
        />
        
        {/* PROGRESS BAR */}
        {isUploading && (
          <div className="mt-4 p-3 bg-[#f8faff] border border-[#184EF0]/25 rounded-none">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                {uploadProgress < 100 ? "Uploading image" : "Processing image"}
              </p>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="relative h-2 w-full bg-[#dbeafe] rounded-none overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#184EF0] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {courseLandingFormData.image?.url && (
          <div className="mt-3">
            <img
              src={courseLandingFormData.image.url}
              alt="Course"
              className="mt-2 w-64 h-36 object-cover rounded-none border border-[#184EF0]/25"
            />
            <p className="text-xs text-gray-500 mt-1">
              Image uploaded successfully
            </p>
          </div>
        )}
        
        {!courseLandingFormData.image?.url && !isUploading && (
          <p className="text-sm text-gray-500 mt-2">
            Upload a course image (required)
          </p>
        )}
      </div>

      <form className="space-y-5">
        {courseLandingPageFormControls.map((control) => (
          <div key={control.name}>
            <label className="block mb-1 font-medium text-gray-700">
              {control.label}
            </label>

            {/* INPUT */}
            {control.componentType === "input" && (
              <input
                name={control.name}
                type={control.type}
                placeholder={control.placeholder}
                value={courseLandingFormData[control.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#184EF0]/25 rounded-none 
                           focus:ring-1 focus:ring-[#184EF0]/20 focus:border-[#184EF0] outline-none"
              />
            )}

            {/* TEXTAREA */}
            {control.componentType === "textarea" && (
              <textarea
                name={control.name}
                placeholder={control.placeholder}
                value={courseLandingFormData[control.name] || ""}
                onChange={handleChange}
                rows={control.rows || 4}
                className="w-full px-4 py-2 border border-[#184EF0]/25 rounded-none 
                           focus:ring-1 focus:ring-[#184EF0]/20 focus:border-[#184EF0] outline-none"
              />
            )}

            {/* SELECT */}
            {control.componentType === "select" && (
              <select
                name={control.name}
                value={courseLandingFormData[control.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#184EF0]/25 rounded-none 
                           focus:ring-1 focus:ring-[#184EF0]/20 focus:border-[#184EF0] outline-none"
              >
                <option value="">{control.placeholder}</option>
                {control.options?.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
