// context/instructor-context/index.jsx
import { createContext, useState } from "react";
import {
  courseLandingInitialFormData,
  courseCurriculumInitialFormData,
  courseSettingsInitialFormData,
} from "@/config";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [courseSettingsFormData, setCourseSettingsFormData] = useState(
    courseSettingsInitialFormData
  );

  const [mediaUploadProgress, setMediaUploadProgress] = useState({});

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        courseSettingsFormData,
        setCourseSettingsFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}