// Course.jsx
import { useState, useEffect, useContext } from "react";
import {
  NotebookPen,
  Trash2,
  Plus,
  Eye,
  X,
  Users,
  Clock,
  Globe,
  BookOpen,
  DollarSign,
  Award,
  Calendar,
  BarChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchInstructorCourseListService,
  deleteCourseService,
} from "@/services";
import { InstructorContext } from "@/context/instructor-context";

export default function ManageCourses() {
  const navigate = useNavigate();
  const { 
    setCourseEditedCourseId, 
    setCourseLandingFormData, 
    setCourseCurriculumFormData 
  } = useContext(InstructorContext);
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetchInstructorCourseListService();
      setCourses(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Failed to load courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(courseId);
      await deleteCourseService(courseId);

      // Remove the course from the list
      setCourses((prev) => prev.filter((course) => course._id !== courseId));

      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/instructor/edit-course/${courseId}`);
  };

  const handlePreviewCourse = (course) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  };

  const handleCreateNewCourse = () => {
    // Clear all context data before creating new course
    if (setCourseEditedCourseId) setCourseEditedCourseId(null);
    
    // Reset landing form data to empty state
    if (setCourseLandingFormData) {
      setCourseLandingFormData({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        language: "",
        pricing: 0,
        level: "beginner",
        isPublished: false,
        image: { url: "", public_id: "" }
      });
    }
    
    // Reset curriculum form data to empty array
    if (setCourseCurriculumFormData) {
      setCourseCurriculumFormData([]);
    }
    
    // Navigate to create course page
    navigate("/instructor/create-course");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to extract all video thumbnails from curriculum
  const getVideoThumbnails = (course) => {
    const thumbnails = [];

    if (!course.curriculum || !Array.isArray(course.curriculum)) {
      return thumbnails;
    }

    course.curriculum.forEach((item) => {
      if (item.videoUrl) {
        thumbnails.push({
          url: item.videoUrl,
          title: item.title || "Video",
        });
      }
    });

    return thumbnails;
  };

  const VideoThumbnail = ({ title, className = "w-20 h-12" }) => (
    <div
      className={`${className} rounded border bg-gradient-to-br from-[#dbeafe] to-[#ffedd5] flex items-center justify-center`}
      aria-label={title ? `${title} video` : "Course video"}
    >
      <BookOpen className="h-4 w-4 text-[#184EF0]" />
    </div>
  );

  // Preview Modal Component
  const PreviewModal = () => {
    if (!previewCourse) return null;

    const videoThumbnails = getVideoThumbnails(previewCourse);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header - Fixed and not transparent */}
          <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Course Preview
                </h2>
                <p className="text-gray-600 mt-1">
                  Complete course details and statistics
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-[#eff6ff] rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  previewCourse.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {previewCourse.isPublished ? "Published" : "Draft"}
              </span>
              <span className="text-sm text-gray-500">
                Created {formatDate(previewCourse.createdAt)}
              </span>
            </div>
          </div>

          {/* Modal Body - Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Hero Section with Image and Basic Info */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col gap-6">
                {/* Course Image/Video */}
                <div className="w-full">
                  {previewCourse.image?.url ? (
                    <img
                      src={previewCourse.image.url}
                      alt={previewCourse.title}
                      className="w-full h-48 md:h-64 object-cover rounded-xl shadow-lg"
                    />
                  ) : videoThumbnails.length > 0 ? (
                    <div className="w-full h-48 md:h-64 bg-gradient-to-br from-[#dbeafe] to-[#ffedd5] rounded-xl shadow-lg flex items-center justify-center">
                      <div className="text-center px-6">
                        <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-[#184EF0] mx-auto mb-3" />
                        <p className="text-sm md:text-base font-medium text-gray-800">
                          {videoThumbnails.length} video
                          {videoThumbnails.length === 1 ? "" : "s"} in this
                          course
                        </p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          Open the course editor to preview individual lectures.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 md:h-64 bg-gradient-to-br from-[#dbeafe] to-[#ffedd5] rounded-xl flex items-center justify-center">
                      <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-[#184EF0]" />
                    </div>
                  )}
                </div>

                {/* Course Basic Info */}
                <div className="w-full">
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">
                    {previewCourse.title}
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                    {previewCourse.description || "No description available"}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="bg-[#fff7f0] p-3 md:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-[#F97316]" />
                        <span className="text-xs md:text-sm text-gray-600">
                          Price
                        </span>
                      </div>
                      <div className="text-base md:text-xl font-bold text-gray-900">
                        {previewCourse.pricing > 0
                          ? formatCurrency(previewCourse.pricing)
                          : "Free"}
                      </div>
                    </div>

                    <div className="bg-[#eff6ff] p-3 md:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 md:h-5 md:w-5 text-[#184EF0]" />
                        <span className="text-xs md:text-sm text-gray-600">
                          Students
                        </span>
                      </div>
                      <div className="text-base md:text-xl font-bold text-gray-900">
                        {previewCourse.enrolledStudents?.length || 0}
                      </div>
                    </div>

                    <div className="bg-[#fff7f0] p-3 md:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 md:h-5 md:w-5 text-[#F97316]" />
                        <span className="text-xs md:text-sm text-gray-600">
                          Level
                        </span>
                      </div>
                      <div className="text-xs md:text-sm font-bold text-gray-900 capitalize">
                        {previewCourse.level || "Not specified"}
                      </div>
                    </div>

                    <div className="bg-[#eff6ff] p-3 md:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart className="h-4 w-4 md:h-5 md:w-5 text-[#184EF0]" />
                        <span className="text-xs md:text-sm text-gray-600">
                          Revenue
                        </span>
                      </div>
                      <div className="text-base md:text-xl font-bold text-gray-900">
                        {formatCurrency(
                          previewCourse.pricing *
                            (previewCourse.enrolledStudents?.length || 0)
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setIsPreviewOpen(false);
                        handleEditCourse(previewCourse._id);
                      }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-[#184EF0] text-white rounded-lg hover:bg-[#123fd0] transition-colors flex items-center justify-center gap-2"
                    >
                      <NotebookPen className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Edit Course</span>
                    </button>
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm md:text-base">
                        Close Preview
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Thumbnails Section */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Videos
              </h3>
              {videoThumbnails.length > 0 ? (
                <div className="space-y-4">
                  {videoThumbnails.map((video, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="w-full h-36 md:h-36 rounded-lg border bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] flex items-center justify-center">
                            <div className="text-center px-4">
                              <BookOpen className="h-8 w-8 text-[#184EF0] mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-800">
                                Lecture Video
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {video.title}
                          </h4>
                          <div className="text-sm text-gray-500">
                            Video {index + 1} of {videoThumbnails.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No videos added to this course yet
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Course Details */}
              <div className="bg-[#f8faff] p-4 md:p-6 rounded-xl border border-[#184EF0]/10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#F97316]" />
                  Course Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <p className="font-medium text-gray-900">
                      {previewCourse.category || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Language:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-[#184EF0]/70" />
                      <span className="font-medium text-gray-900">
                        {previewCourse.language || "English"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Duration:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-[#184EF0]/70" />
                      <span className="font-medium text-gray-900">
                        {previewCourse.duration || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-[#184EF0]/70" />
                      <span className="font-medium text-gray-900">
                        {previewCourse.updatedAt
                          ? formatDate(previewCourse.updatedAt)
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Curriculum Overview */}
              <div className="bg-[#f8faff] p-4 md:p-6 rounded-xl border border-[#184EF0]/10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#184EF0]" />
                  Curriculum
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Curriculum Items:</span>
                    <span className="font-semibold text-gray-900">
                      {previewCourse.curriculum?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Videos:</span>
                    <span className="font-semibold text-gray-900">
                      {videoThumbnails.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-0">
      {/* Preview Modal */}
      {isPreviewOpen && <PreviewModal />}

      {/* Top section */}
      <div className="bg-white border border-[#184EF0]/20 rounded-2xl px-4 md:px-8 py-4 md:py-6 mb-4 md:mb-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              All Courses
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            onClick={handleCreateNewCourse}
            className="px-3 py-2 md:px-4 md:py-2 bg-[#184EF0] text-white rounded-lg shadow hover:bg-[#123fd0] transition flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Create New Course</span>
          </button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#184EF0]"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="text-gray-400 mb-4">
              <NotebookPen className="w-12 h-12 md:w-16 md:h-16 mx-auto" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
              Create your first course to get started!
            </p>
            <button
              onClick={handleCreateNewCourse}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#184EF0] text-white rounded-lg shadow hover:bg-[#123fd0] transition text-sm md:text-base"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 md:px-0 font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="py-3 px-2 md:px-0 font-semibold text-gray-700">
                    Videos
                  </th>
                  <th className="py-3 pr-2 md:pr-7 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-3 pr-2 md:pr-4 font-semibold text-gray-700">
                    Students
                  </th>
                  <th className="py-3 px-2 md:px-0 font-semibold text-gray-700">
                    Revenue
                  </th>
                  <th className="py-3 px-2 md:px-0 font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="py-3 px-2 md:px-0 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => {
                  const videoThumbnails = getVideoThumbnails(course);

                  return (
                    <tr
                      key={course._id}
                      className="border-b border-gray-100 hover:bg-[#f8faff] cursor-pointer"
                      onClick={() => handlePreviewCourse(course)}
                    >
                      <td className="py-4 px-2 md:px-0">
                        <div className="flex items-center gap-2 md:gap-3">
                          {course.image?.url ? (
                            <img
                              src={course.image.url}
                              alt={course.title}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                            />
                          ) : videoThumbnails.length > 0 ? (
                            <VideoThumbnail
                              title={videoThumbnails[0].title}
                              className="w-16 h-10 md:w-20 md:h-12"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#dbeafe] to-[#ffedd5] rounded-lg flex items-center justify-center">
                              <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-[#184EF0]" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-800 hover:text-[#184EF0] transition-colors truncate text-sm md:text-base">
                              {course.title}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 truncate">
                              {course.category} • {course.level}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-2 md:px-0">
                        {videoThumbnails.length > 0 ? (
                          <div className="flex gap-1 md:gap-2 flex-wrap">
                            {videoThumbnails.slice(0, 2).map((video, index) => (
                              <VideoThumbnail
                                key={index}
                                title={video.title}
                                className="w-16 h-10 md:w-20 md:h-12"
                              />
                            ))}
                            {videoThumbnails.length > 3 && (
                              <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  +{videoThumbnails.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 rounded border flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              No videos
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-2 md:px-0">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isPublished
                              ? "bg-[#e9f1ff] text-[#184EF0]"
                              : "bg-[#fff2e8] text-[#F97316]"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-0">
                        <div className="font-medium text-gray-800 flex items-center gap-1 text-sm md:text-base">
                          <Users className="h-3 w-3 md:h-4 md:w-4 text-[#184EF0]/70" />
                          {course.enrolledStudents?.length || 0}
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-0">
                        <div
                          className={`font-medium flex items-center gap-1 text-sm md:text-base ${
                            course.pricing > 0
                              ? "text-[#184EF0]"
                              : "text-gray-600"
                          }`}
                        >
                          <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                          {course.pricing > 0
                            ? formatCurrency(
                                course.pricing *
                                  (course.enrolledStudents?.length || 0)
                              )
                            : "Free"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {course.pricing > 0
                            ? `$${course.pricing} per student`
                            : "Free course"}
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-0 text-gray-600 text-sm md:text-base">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      {/* Action Buttons */}
                      <td
                        className="py-4 px-2 md:px-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          {/* Preview Button */}
                          <button
                            onClick={() => handlePreviewCourse(course)}
                            className="p-1 md:p-2 rounded-lg hover:bg-[#eff6ff] transition inline-flex items-center"
                            title="Preview Course"
                          >
                            <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#184EF0]" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditCourse(course._id)}
                            className="p-1 md:p-2 rounded-lg hover:bg-[#fff4ec] transition inline-flex items-center"
                            title="Edit Course"
                          >
                            <NotebookPen className="w-4 h-4 md:w-5 md:h-5 text-[#F97316]" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeleteCourse(course._id, course.title)
                            }
                            disabled={deletingId === course._id}
                            className="p-1 md:p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center disabled:opacity-50"
                            title="Delete Course"
                          >
                            {deletingId === course._id ? (
                              <span className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-red-500"></span>
                            ) : (
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats summary */}
        {courses.length > 0 && (
          <div className="mt-4 md:mt-6 pt-4 border-t border-[#184EF0]/20">
            <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0 text-xs md:text-sm text-slate-700">
              <div>
                <span className="font-medium">Total Revenue:</span>{" "}
                {formatCurrency(
                  courses.reduce((total, course) => {
                    if (course.pricing > 0) {
                      return (
                        total +
                        course.pricing * (course.enrolledStudents?.length || 0)
                      );
                    }
                    return total;
                  }, 0)
                )}
              </div>
              <div>
                <span className="font-medium">Total Students:</span>{" "}
                {courses.reduce(
                  (total, course) =>
                    total + (course.enrolledStudents?.length || 0),
                  0
                )}
              </div>
              <div>
                <span className="font-medium">Published:</span>{" "}
                {courses.filter((course) => course.isPublished).length} of{" "}
                {courses.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
