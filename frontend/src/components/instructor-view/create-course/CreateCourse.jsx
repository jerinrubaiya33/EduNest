// instructor-view/CreateCourse.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService, mediaDeleteService } from "@/services";

export default function CreateCourse() {
  const [openPreviewId, setOpenPreviewId] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
  } = useContext(InstructorContext);

  const fileInputRefs = useRef({});
  const videoRefs = useRef({});
  const progressFrameRefs = useRef({});

  useEffect(() => {
    return () => {
      Object.values(progressFrameRefs.current).forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
    };
  }, []);

  /* ADD LECTURE */
  const handleAddLecture = () => {
    // Check if there are any previous lectures that are incomplete
    const hasIncompletePreviousLectures = courseCurriculumFormData.some(
      (lecture, index) => {
        // For all lectures except the last one, check if they're complete
        if (index < courseCurriculumFormData.length - 1) {
          return !lecture.title.trim() || !lecture.videoUrl;
        }
        return false;
      }
    );

    // Check if the last lecture is complete
    const lastLecture =
      courseCurriculumFormData[courseCurriculumFormData.length - 1];
    const isLastLectureComplete = lastLecture
      ? lastLecture.title.trim() && lastLecture.videoUrl
      : true; // If no lectures exist, allow adding first one

    if (hasIncompletePreviousLectures) {
      alert(
        "Please complete all previous lectures (title and video) before adding a new one."
      );
      return;
    }

    if (!isLastLectureComplete) {
      return; // Button is disabled, so this shouldn't happen, but just in case
    }

    setCourseCurriculumFormData((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        videoUrl: "",
        videoName: "",
        freePreview: false,
        public_id: "",
      },
    ]);
  };
  /* UPDATE */
  const handleLectureChange = (id, field, value) => {
    setCourseCurriculumFormData((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  /* REMOVE LECTURE + DELETE CLOUDINARY VIDEO */
  const handleRemoveLecture = async (id) => {
    const lecture = courseCurriculumFormData.find((l) => l.id === id);

    if (lecture?.public_id) {
      try {
        await mediaDeleteService(lecture.public_id, "video");
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    if (progressFrameRefs.current[id]) {
      cancelAnimationFrame(progressFrameRefs.current[id]);
      delete progressFrameRefs.current[id];
    }

    setCourseCurriculumFormData((prev) => prev.filter((l) => l.id !== id));
    setMediaUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  /* SMOOTH PROGRESS */
  const animateProgress = (id, target) => {
    if (progressFrameRefs.current[id]) {
      cancelAnimationFrame(progressFrameRefs.current[id]);
    }

    const step = () => {
      setMediaUploadProgress((prev) => {
        const current = prev[id] || 0;

        if (current >= target) {
          delete progressFrameRefs.current[id];
          return prev;
        }

        const nextValue = Math.min(current + 1, target);
        progressFrameRefs.current[id] = requestAnimationFrame(step);

        return { ...prev, [id]: nextValue };
      });
    };

    progressFrameRefs.current[id] = requestAnimationFrame(step);
  };

  /* UPLOAD VIDEO (DELETE OLD FIRST) */
  const handleVideoUpload = async (id, file) => {
    try {
      const lecture = courseCurriculumFormData.find((l) => l.id === id);

      // delete old Cloudinary video if exists
      if (lecture?.public_id) {
        try {
          await mediaDeleteService(lecture.public_id, "video");
        } catch (err) {
          console.error("Old video delete failed:", err);
        }
      }

      // show progress bar immediately
      setMediaUploadProgress((p) => ({ ...p, [id]: 1 }));

      setTimeout(() => {
        animateProgress(id, 5);
      }, 50);

      const onUploadProgress = (e) => {
        if (!e?.total) return;
        const percent = Math.round((e.loaded * 100) / e.total);
        // Ensure minimum progress is 5% for visibility
        const adjustedPercentage = Math.max(5, percent);
        animateProgress(id, adjustedPercentage);
      };

      const res = await mediaUploadService(file, onUploadProgress);
      const data = res.data || res;

      setCourseCurriculumFormData((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                videoUrl: data.secure_url || data.url,
                videoName: file.name,
                public_id: data.public_id,
              }
            : l
        )
      );

      animateProgress(id, 100);

      setTimeout(() => {
        if (progressFrameRefs.current[id]) {
          cancelAnimationFrame(progressFrameRefs.current[id]);
          delete progressFrameRefs.current[id];
        }
        setMediaUploadProgress((p) => {
          const copy = { ...p };
          delete copy[id];
          return copy;
        });
      }, 1500);
    } catch (err) {
      console.error("Upload failed:", err);
      if (progressFrameRefs.current[id]) {
        cancelAnimationFrame(progressFrameRefs.current[id]);
        delete progressFrameRefs.current[id];
      }
      setMediaUploadProgress((p) => ({ ...p, [id]: -1 }));
    }
  };

  // Function to check if previous lectures are complete
  const isPreviousLecturesComplete = (currentIndex) => {
    if (currentIndex === 0) return true; // First lecture always allowed

    // Check all lectures before the current index
    for (let i = 0; i < currentIndex; i++) {
      const lecture = courseCurriculumFormData[i];
      if (!lecture.title.trim() || !lecture.videoUrl) {
        return false;
      }
    }
    return true;
  };

  // Check if "Add Lecture" button should be enabled
  const isAddLectureButtonEnabled = () => {
    // If there are no lectures, button should be enabled
    if (courseCurriculumFormData.length === 0) return true;

    // Check if all lectures are complete
    const allLecturesComplete = courseCurriculumFormData.every(
      (lecture) => lecture.title.trim() && lecture.videoUrl
    );

    return allLecturesComplete;
  };

  /* UI */
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Create Course Curriculum</h3>

      <button
        onClick={handleAddLecture}
        className={`mb-4 px-4 py-2 rounded-none transition-colors ${
          isAddLectureButtonEnabled()
            ? "bg-[#184EF0] text-white hover:bg-[#123fd0] cursor-pointer"
            : "bg-[#184EF0]/60 text-white cursor-not-allowed"
        }`}
        disabled={!isAddLectureButtonEnabled()}
      >
        {isAddLectureButtonEnabled()
          ? "Add Lecture"
          : "Complete Current Lecture First"}
      </button>

      {courseCurriculumFormData.map((lecture, index) => {
        const progress = mediaUploadProgress[lecture.id] ?? 0;
        const isUploading = progress > 0 && progress < 100;
        const uploadFailed = progress === -1;
        const previousLecturesComplete = isPreviousLecturesComplete(index);
        const isCurrentLectureComplete =
          lecture.title.trim() && lecture.videoUrl;

        return (
          <div
            key={lecture.id}
            className={`border ${
              previousLecturesComplete
                ? "border-[#184EF0]/25"
                : "border-gray-300 opacity-70"
            } p-4 rounded-none mb-4 bg-white`}
          >
            <h4 className="font-semibold mb-2">Lecture {index + 1}</h4>

            {/* Warning message if previous lectures are incomplete */}
            {!previousLecturesComplete && (
              <div className="mb-3 p-2 bg-[#fff7f0] border border-[#F97316]/30 rounded-none">
                <p className="text-[#F97316] text-sm">
                  ⚠️ Please complete previous lectures first.
                </p>
              </div>
            )}

            <input
              className={`border ${
                previousLecturesComplete
                  ? "border-[#184EF0]/25 focus:ring focus:ring-[#184EF0]/20"
                  : "border-gray-300"
              } p-2 mb-3 w-full rounded-none focus:outline-none ${
                !previousLecturesComplete ? "bg-gray-100" : ""
              }`}
              placeholder="Lecture Title"
              value={lecture.title}
              onChange={(e) =>
                handleLectureChange(lecture.id, "title", e.target.value)
              }
              disabled={!previousLecturesComplete}
            />

            <input
              type="file"
              hidden
              accept="video/*"
              ref={(el) => (fileInputRefs.current[lecture.id] = el)}
              onChange={(e) =>
                e.target.files &&
                handleVideoUpload(lecture.id, e.target.files[0])
              }
              disabled={!previousLecturesComplete}
            />

            {/* PROGRESS BAR - Show when progress is between 1 and 99 (inclusive) */}
              {progress > 0 && progress < 100 && (
              <div className="mb-3">
                <div className="h-3 bg-[#dbeafe] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#184EF0] text-white text-xs text-center leading-3 transition-all duration-300"
                    style={{ width: `${Math.max(5, progress)}%` }}
                  >
                    {progress}%
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {progress === 1
                    ? "Starting upload..."
                    : `Uploading... ${progress}%`}
                </p>
              </div>
            )}

            {/* Upload failed message */}
            {uploadFailed && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-none">
                <p className="text-red-600 text-sm">
                  ❌ Upload failed. Please try again.
                </p>
                <button
                  onClick={() => fileInputRefs.current[lecture.id]?.click()}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-none text-sm"
                  disabled={!previousLecturesComplete}
                >
                  Retry Upload
                </button>
              </div>
            )}

            {/* UPLOAD BUTTON - Show when NOT uploading, NOT failed, and no video */}
            {!lecture.videoUrl &&
              !isUploading &&
              !uploadFailed &&
              previousLecturesComplete && (
                <button
                  onClick={() => fileInputRefs.current[lecture.id]?.click()}
                  className="w-full border border-dashed border-[#184EF0]/35 rounded-none py-2 mb-3 hover:bg-[#eff6ff] transition-colors"
                >
                  📹 Upload course video
                </button>
              )}

            {/* Disabled upload button if previous lectures incomplete */}
            {!lecture.videoUrl &&
              !isUploading &&
              !uploadFailed &&
              !previousLecturesComplete && (
                <button
                  className="w-full border border-dashed border-gray-300 rounded-none py-2 mb-3 bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  ⏳ Complete previous lectures first
                </button>
              )}

            {/* Video already uploaded or replace button */}
            {lecture.videoUrl &&
              !isUploading &&
              !uploadFailed &&
              previousLecturesComplete && (
                <button
                  onClick={() => fileInputRefs.current[lecture.id]?.click()}
                  className="w-full border border-dashed border-[#184EF0]/30 rounded-none py-2 mb-3 hover:bg-[#eff6ff] transition-colors"
                >
                  🎬 {lecture.videoName} (replace)
                </button>
              )}

            {/* Disabled replace button if previous lectures incomplete */}
            {lecture.videoUrl &&
              !isUploading &&
              !uploadFailed &&
              !previousLecturesComplete && (
                <button
                  className="w-full border border-dashed border-gray-300 rounded-none py-2 mb-3 bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  🎬 {lecture.videoName} (locked - complete previous lectures)
                </button>
              )}

            {/* PREVIEW */}
            {lecture.videoUrl && previousLecturesComplete && (
              <>
                <button
                  onClick={() =>
                    setOpenPreviewId(
                      openPreviewId === lecture.id ? null : lecture.id
                    )
                  }
                  className="bg-[#184EF0] text-white px-2 py-1 rounded-none text-sm hover:bg-[#123fd0] transition-colors"
                >
                  🎬 {openPreviewId === lecture.id ? "Hide" : "Preview"}
                </button>

                {openPreviewId === lecture.id && (
                  <div
                    className="relative mt-3 border border-[#184EF0]/30 rounded-none overflow-hidden"
                    onMouseEnter={() => setHoveredVideoId(lecture.id)}
                    onMouseLeave={() => setHoveredVideoId(null)}
                  >
                    <video
                      ref={(el) => (videoRefs.current[lecture.id] = el)}
                      src={lecture.videoUrl}
                      controls={hoveredVideoId === lecture.id}
                      className="w-full max-h-[320px] bg-black"
                    />

                    {hoveredVideoId === lecture.id && (
                      <div className="absolute inset-0 flex items-center justify-center gap-8 bg-black/30 pointer-events-none">
                        <button
                          className="pointer-events-auto w-12 h-12 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            videoRefs.current[lecture.id].currentTime -= 5;
                          }}
                        >
                          ↻ 5s
                        </button>
                        <button
                          className="pointer-events-auto w-12 h-12 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            videoRefs.current[lecture.id].currentTime += 5;
                          }}
                        >
                          5s ⟳
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Disabled preview button if previous lectures incomplete */}
            {lecture.videoUrl && !previousLecturesComplete && (
              <button
                className="bg-gray-300 px-2 py-1 rounded-none text-sm text-gray-500 cursor-not-allowed"
                disabled
              >
                🎬 Preview (locked)
              </button>
            )}

            {/* FREE PREVIEW */}
            <div className="flex items-center mt-3">
              <button
                onClick={() =>
                  handleLectureChange(
                    lecture.id,
                    "freePreview",
                    !lecture.freePreview
                  )
                }
                className={`w-12 h-6 rounded-full p-1 flex ${
                  !previousLecturesComplete
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${
                  lecture.freePreview
                    ? "bg-[#184EF0] justify-end"
                    : "bg-gray-300 justify-start"
                }`}
                disabled={!previousLecturesComplete}
              >
                <div className="bg-white w-4 h-4 rounded-full" />
              </button>
              <span
                className={`ml-2 ${
                  !previousLecturesComplete ? "text-gray-400" : ""
                }`}
              >
                Free Preview
              </span>
            </div>

            <button
              onClick={() => handleRemoveLecture(lecture.id)}
              className="text-red-600 underline mt-3 hover:text-red-800"
            >
              ✗ Remove Lecture
            </button>

            {/* Completion indicator */}
            {isCurrentLectureComplete && previousLecturesComplete && (
              <div className="mt-2 text-sm text-black underline">
                Lecture {index + 1} completed
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
