// // services/index.js 
// import axiosInstance from "@/lib/axiosInstance";

// export async function registerService(formData) {
//   const { data } = await axiosInstance.post("/auth/register", {
//     ...formData,
//     role: "user",
//   });

//   return data;
// }

// export async function loginService(formData) {
//   const { data } = await axiosInstance.post("/auth/login", formData);

//   return data;
// }

// export async function checkAuthService() {
//   const { data } = await axiosInstance.get("/auth/check-auth");

//   return data;
// }

// export async function mediaUploadService(file, onProgressCallback) {
//   const formData = new FormData();
//   formData.append("file", file); 

//   const { data } = await axiosInstance.post(
//     "/instructor/media/upload", 
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: (progressEvent) => {
//         if (onProgressCallback) {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           onProgressCallback(percentCompleted);
//         }
//       },
//     }
//   );

//   return data;
// }

// export async function mediaDeleteService(public_id, resource_type = "video") {
//   const { data } = await axiosInstance.delete(
//     "/instructor/media/delete",
//     {
//       data: {
//         public_id,
//         resource_type,
//       },
//     }
//   );

//   return data;
// }

// // Changed from /instructor/course/get to /instructor/courses
// export async function fetchInstructorCourseListService() {
//   const { data } = await axiosInstance.get(`/instructor/courses`);
//   return data;
// }

// // Changed from /instructor/course/add to /instructor/courses
// export async function addNewCourseService(formData) {
//   const { data } = await axiosInstance.post(`/instructor/courses`, formData);
//   return data;
// }

// // Changed from /instructor/course/get/details/${id} to /instructor/courses/instructor/${id}
// export async function fetchInstructorCourseDetailsService(id) {
//   const { data } = await axiosInstance.get(
//     `/instructor/courses/instructor/${id}`
//   );
//   return data;
// }

// // Changed from /instructor/course/update/${id} to /instructor/courses/${id}
// export async function updateCourseByIdService(id, formData) {
//   const { data } = await axiosInstance.put(
//     `/instructor/courses/${id}`,
//     formData
//   );
//   return data;
// }

// // ADD THIS: Delete course service
// f {
//   const { data } = await axiosInstance.delete(
//     `/instructor/courses/${id}`
//   );
//   return data;
// }

// export async function mediaBulkUploadService(formData, onProgressCallback) {
//   const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
//     onUploadProgress: (progressEvent) => {
//       const percentCompleted = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );
//       onProgressCallback(percentCompleted);
//     },
//   });

//   return data;
// }

// export async function fetchStudentViewCourseListService(query) {
//   const { data } = await axiosInstance.get(`/student/course/get?${query}`);
//   return data;
// }

// export async function fetchStudentViewCourseDetailsService(courseId) {
//   const { data } = await axiosInstance.get(
//     `/student/course/get/details/${courseId}`
//   );
//   return data;
// }

// export async function checkCoursePurchaseInfoService(courseId, studentId) {
//   const { data } = await axiosInstance.get(
//     `/student/course/purchase-info/${courseId}/${studentId}`
//   );
//   return data;
// }

// export async function createPaymentService(formData) {
//   const { data } = await axiosInstance.post(`/student/order/create`, formData);
//   return data;
// }

// export async function captureAndFinalizePaymentService(
//   paymentId,
//   payerId,
//   orderId
// ) {
//   const { data } = await axiosInstance.post(`/student/order/capture`, {
//     paymentId,
//     payerId,
//     orderId,
//   });
//   return data;
// }

// export async function fetchStudentBoughtCoursesService(studentId) {
//   const { data } = await axiosInstance.get(
//     `/student/courses-bought/get/${studentId}`
//   );
//   return data;
// }

// export async function getCurrentCourseProgressService(userId, courseId) {
//   const { data } = await axiosInstance.get(
//     `/student/course-progress/get/${userId}/${courseId}`
//   );
//   return data;
// }

// export async function markLectureAsViewedService(userId, courseId, lectureId) {
//   const { data } = await axiosInstance.post(
//     `/student/course-progress/mark-lecture-viewed`,
//     {
//       userId,
//       courseId,
//       lectureId,
//     }
//   );
//   return data;
// }

// export async function resetCourseProgressService(userId, courseId) {
//   const { data } = await axiosInstance.post(
//     `/student/course-progress/reset-progress`,
//     {
//       userId,
//       courseId,
//     }
//   );
//   return data;
// }










// services/index.js
import axiosInstance from "@/lib/axiosInstance";

/* AUTH SERVICES (UNCHANGED) */
export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
}

/* MEDIA SERVICES (UNCHANGED) */
export async function mediaUploadService(file, onProgressCallback) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post(
    "/instructor/media/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgressCallback) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgressCallback(percentCompleted);
        }
      },
    }
  );

  return data;
}

export async function mediaDeleteService(public_id, resource_type = "video") {
  const { data } = await axiosInstance.delete(
    "/instructor/media/delete",
    {
      data: { public_id, resource_type },
    }
  );
  return data;
}

/* INSTRUCTOR COURSE SERVICES (UNCHANGED) */
export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/courses`);
  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/courses`, formData);
  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/courses/instructor/${id}`
  );
  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/courses/${id}`,
    formData
  );
  return data;
}

export async function deleteCourseService(id) {
  const { data } = await axiosInstance.delete(
    `/instructor/courses/${id}`
  );
  return data;
}

/* STUDENT COURSE SERVICES (FIXED) */

// Get all published courses (with filters)
export async function fetchStudentViewCourseListService(query = "") {
  const { data } = await axiosInstance.get(
    `/student/courses${query ? `?${query}` : ""}`
  );

  // If the frontend deploy rewrites `/api/*` to the SPA entry, Vercel can return HTML (200)
  // which silently breaks the UI (no `success` field).
  if (typeof data === "string" && /<html[\s>]/i.test(data)) {
    throw new Error(
      "API request returned HTML instead of JSON. In production, set VITE_API_URL (or VITE_BACKEND_URL) to your backend origin (e.g. https://your-backend.vercel.app) and ensure frontend rewrites don't catch /api."
    );
  }

  return data;
}

// Search courses
export async function searchStudentCoursesService(searchQuery) {
  const { data } = await axiosInstance.get(
    `/student/courses/search?q=${searchQuery}`
  );
  return data;
}

// Get courses by category
export async function fetchCoursesByCategoryService(categoryId) {
  const { data } = await axiosInstance.get(
    `/student/courses/category/${categoryId}`
  );
  return data;
}

// Get course details (student-safe)
export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/courses/${courseId}`
  );
  return data;
}

/* PURCHASE & PROGRESS (UNCHANGED) */
export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );
  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);
  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });
  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );
  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );
  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    { userId, courseId, lectureId }
  );
  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    { userId, courseId }
  );
  return data;
}
