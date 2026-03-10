// EditCourse.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  X,
  ArrowLeft,
  Upload,
  Loader2,
  Eye,
  Video,
  Trash2,
  Plus,
  Edit2,
} from "lucide-react";
import api from "@/api/axios";
import { InstructorContext } from "@/context/instructor-context";
import { courseLandingPageFormControls } from "@/config";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    courseCurriculumFormData,
  } = useContext(InstructorContext);

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState({});

  /* LOAD COURSE + CURRICULUM */
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { data } = await api.get(
          `/api/instructor/courses/instructor/${id}`,
        );

        const course = data.course;
        setCourse(course);

        /* ---------- LANDING DATA ---------- */
        const mapped = {};
        courseLandingPageFormControls.forEach((c) => {
          mapped[c.name] = course[c.name] || "";
        });

        const landingData = {
          ...mapped,
          pricing: course.pricing || 0,
          level: course.level || "beginner",
          isPublished: course.isPublished || false,
          image: course.image || { url: "", public_id: "" },
        };

        setFormData(landingData);
        setCourseLandingFormData(landingData);

        /* ---------- CURRICULUM ---------- */
        if (Array.isArray(course.curriculum)) {
          setCourseCurriculumFormData(
            course.curriculum.map((lec) => ({
              id: lec._id || crypto.randomUUID(),
              title: lec.title || "",
              videoUrl: lec.videoUrl || "",
              videoName: lec.videoName || "",
              freePreview: lec.freePreview || false,
              public_id: lec.public_id || "",
            })),
          );
        } else {
          // Initialize with empty curriculum if none exists
          setCourseCurriculumFormData([]);
        }
      } catch (err) {
        console.error("Load course error:", err);
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, setCourseLandingFormData, setCourseCurriculumFormData]);

  /* INPUT CHANGE - LANDING PAGE */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((p) => ({ ...p, [name]: val }));
    setCourseLandingFormData((p) => ({ ...p, [name]: val }));
  };

  /* IMAGE UPLOAD */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const { data } = await api.post("/api/instructor/media/upload", fd, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      const img = data.data || data;
      const newImage = {
        url: img.secure_url || img.url,
        public_id: img.public_id,
      };

      setFormData((p) => ({ ...p, image: newImage }));
      setCourseLandingFormData((p) => ({ ...p, image: newImage }));
    } catch (err) {
      alert(
        err.response?.data?.message || "Image upload failed. Please try again.",
      );
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  /* REMOVE NEWLY UPLOADED IMAGE - Restore original */
  const handleRemoveImage = () => {
    if (!course || !course.image) return;

    // Restore the original course image
    setFormData((p) => ({ ...p, image: course.image }));
    setCourseLandingFormData((p) => ({ ...p, image: course.image }));
  };

  /* CURRICULUM HANDLERS */
  const handleAddLecture = () => {
    const newLecture = {
      id: crypto.randomUUID(),
      title: "",
      videoUrl: "",
      videoName: "",
      freePreview: false,
      public_id: "",
    };
    setCourseCurriculumFormData((prev) => [...prev, newLecture]);
  };

  const handleLectureChange = (id, field, value) => {
    setCourseCurriculumFormData((prev) =>
      prev.map((lecture) =>
        lecture.id === id ? { ...lecture, [field]: value } : lecture,
      ),
    );
  };

  const handleRemoveLecture = async (id) => {
    const lectureToRemove = courseCurriculumFormData.find(l => l.id === id);
    
    // If lecture has a video uploaded to Cloudinary, delete it first
    if (lectureToRemove?.public_id) {
      try {
        await api.delete(`/api/instructor/media/delete`, {
          data: { public_id: lectureToRemove.public_id }
        });
      } catch (err) {
        console.error("Failed to delete video from Cloudinary:", err);
        // Continue with removal even if Cloudinary delete fails
      }
    }
    
    // Remove from local state
    setCourseCurriculumFormData((prev) =>
      prev.filter((lecture) => lecture.id !== id),
    );
  };

  /* VIDEO UPLOAD FOR CURRICULUM */
  const handleVideoUpload = async (lectureId, file) => {
    if (!file) return;

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert("Video size should be less than 500MB");
      return;
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid video file (MP4, MOV, AVI, MKV, WebM)");
      return;
    }

    const lecture = courseCurriculumFormData.find(l => l.id === lectureId);
    
    // Delete old video from Cloudinary if exists
    if (lecture?.public_id) {
      try {
        await api.delete(`/api/instructor/media/delete`, {
          data: { public_id: lecture.public_id }
        });
      } catch (err) {
        console.error("Failed to delete old video:", err);
        // Continue with upload anyway
      }
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setVideoUploadProgress(prev => ({ ...prev, [lectureId]: 0 }));
      
      const { data } = await api.post("/api/instructor/media/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setVideoUploadProgress(prev => ({ ...prev, [lectureId]: percent }));
        },
      });

      const videoData = data.data || data;
      handleLectureChange(
        lectureId,
        "videoUrl",
        videoData.secure_url || videoData.url,
      );
      handleLectureChange(lectureId, "videoName", file.name);
      handleLectureChange(lectureId, "public_id", videoData.public_id);
      setEditingVideoId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Video upload failed");
      console.error("Video upload error:", err);
    } finally {
      setVideoUploadProgress(prev => ({ ...prev, [lectureId]: null }));
    }
  };

  /* EDIT VIDEO - Start editing mode */
  const handleEditVideo = (lectureId) => {
    setEditingVideoId(lectureId);
  };

  /* CANCEL VIDEO EDIT */
  const handleCancelEditVideo = () => {
    setEditingVideoId(null);
  };

  /* DELETE VIDEO FROM CLOUDINARY */
  const handleDeleteVideo = async (lectureId) => {
    const lecture = courseCurriculumFormData.find(l => l.id === lectureId);
    
    if (!lecture?.public_id) {
      // Just clear the video data if no Cloudinary public_id exists
      handleLectureChange(lectureId, "videoUrl", "");
      handleLectureChange(lectureId, "videoName", "");
      handleLectureChange(lectureId, "public_id", "");
      setEditingVideoId(null);
      return;
    }

    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await api.delete(`/api/instructor/media/delete`, {
          data: { public_id: lecture.public_id }
        });
        
        handleLectureChange(lectureId, "videoUrl", "");
        handleLectureChange(lectureId, "videoName", "");
        handleLectureChange(lectureId, "public_id", "");
        setEditingVideoId(null);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete video");
        console.error("Delete video error:", err);
      }
    }
  };

  /* SAVE EVERYTHING */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      setError("Course title is required");
      return;
    }

    if (!formData.image?.url) {
      setError("Course image is required");
      return;
    }

    // Check for incomplete lectures
    const incompleteLecture = courseCurriculumFormData.some(
      (l) => !l.title.trim() || !l.videoUrl,
    );

    if (incompleteLecture) {
      setError("Please complete all lectures before saving");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        pricing: Number(formData.pricing) || 0,
        curriculum: courseCurriculumFormData.map((l) => ({
          title: l.title,
          videoUrl: l.videoUrl,
          videoName: l.videoName,
          freePreview: l.freePreview,
          public_id: l.public_id,
        })),
      };

      await api.put(`/api/instructor/courses/${id}`, payload);

      setSuccess("Course updated successfully!");
      setTimeout(() => navigate("/instructor/courses"), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Update failed. Please try again.";
      setError(errorMessage);
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#184EF0]" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="bg-[#184EF0] text-white px-6 py-2 rounded-lg hover:bg-[#123fd0] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate("/instructor/courses")}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Courses
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-1">
                Update your course information, videos, and settings
              </p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Save className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Image Section */}
          <div className="bg-white rounded-xl border border-[#184EF0]/25 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Image
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.image?.url
                    ? "Current course image (upload new one to replace)"
                    : "Upload a high-quality image that represents your course (max 5MB)"}
                </p>
              </div>
              {!formData.image?.url && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Required
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Image Preview */}
              {formData.image?.url && (
                <div className="relative group">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={formData.image.url}
                        alt="Course preview"
                        className="w-64 h-36 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {course.image?.url === formData.image?.url
                          ? "Original course image"
                          : "Newly uploaded image"}
                      </p>
                      {course.image?.url !== formData.image?.url && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove new image (restore original)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Section */}
              <div className="mt-4">
                <label className="block">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#184EF0]/25 rounded-lg hover:border-[#184EF0]/40 transition-colors bg-[#f8faff] cursor-pointer">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-12 w-12 text-[#184EF0]/70" />
                      <div className="flex text-sm text-gray-600">
                        <span className="relative rounded-md font-medium text-[#184EF0] hover:text-[#184EF0] focus-within:outline-none">
                          {formData.image?.url
                            ? "Upload new image"
                            : "Upload a file"}
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {formData.image?.url && (
                        <p className="text-xs text-[#184EF0] mt-1">
                          Uploading will replace the current image
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4 p-4 bg-[#f8faff] rounded-lg border border-[#184EF0]/25">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      {uploadProgress < 100
                        ? "Uploading image..."
                        : "Processing..."}
                    </p>
                    <span className="text-sm font-medium text-[#184EF0]">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-[#dbeafe] rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-[#184EF0] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!formData.image?.url && !isUploading && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Course image is required
                </p>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-xl border border-[#184EF0]/25 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Course Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseLandingPageFormControls.map((control) => (
                <div
                  key={control.name}
                  className={
                    control.componentType === "textarea" ? "md:col-span-2" : ""
                  }
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {control.label}
                    {control.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {/* INPUT */}
                  {control.componentType === "input" && (
                    <input
                      name={control.name}
                      type={control.type}
                      placeholder={control.placeholder}
                      value={formData[control.name] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                               focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                               outline-none transition-colors text-gray-900
                               placeholder:text-gray-400"
                    />
                  )}

                  {/* TEXTAREA */}
                  {control.componentType === "textarea" && (
                    <textarea
                      name={control.name}
                      placeholder={control.placeholder}
                      value={formData[control.name] || ""}
                      onChange={handleChange}
                      rows={control.rows || 4}
                      className="w-full px-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                               focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                               outline-none transition-colors text-gray-900
                               placeholder:text-gray-400 resize-y"
                    />
                  )}

                  {/* SELECT */}
                  {control.componentType === "select" && (
                    <select
                      name={control.name}
                      value={formData[control.name] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                               focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                               outline-none transition-colors text-gray-900 bg-white"
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
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="bg-white rounded-xl border border-[#184EF0]/25 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Curriculum
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add lectures and upload video content for your course
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLecture}
                className="flex items-center px-4 py-2 bg-[#184EF0] text-white rounded-lg hover:bg-[#123fd0] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lecture
              </button>
            </div>

            <div className="space-y-4">
              {courseCurriculumFormData.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No lectures added yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click "Add Lecture" to get started
                  </p>
                </div>
              ) : (
                courseCurriculumFormData.map((lecture, index) => (
                  <div
                    key={lecture.id}
                    className="border border-[#184EF0]/25 rounded-lg p-4 bg-[#f8faff]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#e9f1ff] text-[#184EF0] rounded-full mr-3">
                          <span className="font-medium">{index + 1}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Lecture {index + 1}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        {lecture.videoUrl && editingVideoId !== lecture.id && (
                          <button
                            type="button"
                            onClick={() => handleEditVideo(lecture.id)}
                            className="text-[#184EF0] hover:text-[#123fd0]"
                            title="Edit video"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveLecture(lecture.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete lecture"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Lecture Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lecture Title *
                        </label>
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) =>
                            handleLectureChange(
                              lecture.id,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Enter lecture title"
                          className="w-full px-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                                   focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                                   outline-none transition-colors"
                        />
                      </div>

                      {/* Video Upload/Edit Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video File *
                        </label>
                        
                        {/* Show existing video when not editing */}
                        {lecture.videoUrl && editingVideoId !== lecture.id ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border border-green-300 rounded-lg bg-green-50">
                              <div className="flex items-center">
                                <Video className="h-5 w-5 text-green-500 mr-2" />
                                <div>
                                  <span className="text-sm font-medium text-gray-700 block">
                                    {lecture.videoName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Click "Edit" to replace this video
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a
                                  href={lecture.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[#184EF0] hover:text-[#123fd0] px-3 py-1 border border-[#184EF0]/25 rounded hover:bg-[#f8faff]"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Upload/Edit interface */
                          <div className="space-y-3">
                            {editingVideoId === lecture.id && lecture.videoUrl && (
                              <div className="p-3 border border-[#184EF0]/25 rounded-lg bg-[#f8faff]">
                                <p className="text-sm text-[#184EF0] mb-2">
                                  ⚠️ Uploading a new video will replace the existing one.
                                </p>
                                <button
                                  type="button"
                                  onClick={handleCancelEditVideo}
                                  className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                  Cancel editing
                                </button>
                              </div>
                            )}

                            {/* Upload Progress */}
                            {videoUploadProgress[lecture.id] !== undefined && videoUploadProgress[lecture.id] !== null && (
                              <div className="p-3 border border-[#184EF0]/25 rounded-lg bg-[#f8faff]">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    {videoUploadProgress[lecture.id] < 100
                                      ? "Uploading video..."
                                      : "Processing..."}
                                  </p>
                                  <span className="text-sm font-medium text-[#184EF0]">
                                    {videoUploadProgress[lecture.id]}%
                                  </span>
                                </div>
                                <div className="relative h-2 w-full bg-[#dbeafe] rounded-full overflow-hidden">
                                  <div
                                    className="absolute left-0 top-0 h-full bg-[#184EF0] transition-all duration-300"
                                    style={{ width: `${videoUploadProgress[lecture.id]}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Upload Area */}
                            <label className="block cursor-pointer">
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#184EF0]/25 rounded-lg hover:border-[#184EF0]/40 transition-colors">
                                <div className="space-y-1 text-center">
                                  <Upload className="mx-auto h-8 w-8 text-[#184EF0]/70" />
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium text-[#184EF0]">
                                      {lecture.videoUrl ? "Upload new video" : "Click to upload"}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      MP4, MOV, AVI, MKV, WebM up to 500MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  handleVideoUpload(lecture.id, e.target.files[0])
                                }
                                className="sr-only"
                                disabled={videoUploadProgress[lecture.id] !== undefined && videoUploadProgress[lecture.id] !== null}
                              />
                            </label>

                            {/* Delete button when editing existing video */}
                            {editingVideoId === lecture.id && lecture.videoUrl && (
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(lecture.id)}
                                className="w-full mt-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Current Video
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Free Preview Toggle */}
                      <div className="flex items-center justify-between p-3 border border-[#184EF0]/25 rounded-lg bg-[#f8faff]">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Free Preview
                          </p>
                          <p className="text-xs text-gray-500">
                            Allow students to preview this lecture for free
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleLectureChange(
                              lecture.id,
                              "freePreview",
                              !lecture.freePreview,
                            )
                          }
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full 
                            transition-colors duration-200 ease-in-out 
                            ${lecture.freePreview ? "bg-[#184EF0]" : "bg-gray-300"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white 
                              transition-transform duration-200 ease-in-out
                              ${lecture.freePreview ? "translate-x-6" : "translate-x-1"}
                            `}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pricing & Settings */}
          <div className="bg-white rounded-xl border border-[#184EF0]/25 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Pricing & Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="pricing"
                    min="0"
                    step="0.01"
                    value={formData.pricing || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                             focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                             outline-none transition-colors"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Set 0 for free course
                </p>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="level"
                  value={formData.level || "beginner"}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#184EF0]/25 rounded-lg 
                           focus:ring-1 focus:ring-[#184EF0]/30 focus:border-[#184EF0] 
                           outline-none transition-colors text-gray-900 bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>

              {/* Published Status */}
              <div className="md:col-span-2">
                <div className="flex items-center p-4 border border-[#184EF0]/25 rounded-lg bg-gray-50">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublished"
                      name="isPublished"
                      type="checkbox"
                      checked={formData.isPublished || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#184EF0] border-[#184EF0]/25 rounded focus:ring-[#184EF0]/30"
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="isPublished"
                      className="font-medium text-gray-900"
                    >
                      Publish Course
                    </label>
                    <p className="text-sm text-gray-500">
                      Make this course available to students immediately
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formData.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#184EF0]/25">
            <button
              type="button"
              onClick={() => navigate("/instructor/courses")}
              className="px-6 py-3 border border-[#184EF0]/25 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isUploading || Object.values(videoUploadProgress).some(p => p !== undefined && p !== null && p < 100)}
              className="px-8 py-3 bg-[#184EF0] text-white rounded-lg hover:bg-[#123fd0] 
                       focus:ring-1 focus:ring-[#184EF0]/30 focus:ring-offset-2 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
