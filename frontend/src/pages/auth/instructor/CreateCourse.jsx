// instructor/CreateCourse.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SettingsTab from "@/components/instructor-view/create-course/SettingsTab";
import CurriculumTab from "@/components/instructor-view/create-course/CreateCourse";
import LandingPageTab from "@/components/instructor-view/create-course/LandingPageTab";
import { InstructorContext } from "@/context/instructor-context";
import { addNewCourseService } from "@/services"; 

export default function CreateCourse() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("curriculum");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get context data to check completion
  const { 
    courseLandingFormData, 
    courseCurriculumFormData,
    courseSettingsFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    setCourseSettingsFormData
  } = useContext(InstructorContext);

  // Track user interaction for settings
  const [userInteractedWithSettings, setUserInteractedWithSettings] = useState({
    pricing: false,
    isPublished: false,
  });

  // Track initial settings to detect changes
  useEffect(() => {
    // Check if settings have changed from initial values
    const initialSettings = {
      pricing: 0,
      isPublished: false,
      accessType: "lifetime",
      hasCertificate: false,
      requirements: "",
    };

    const hasPricingChanged = courseSettingsFormData.pricing !== initialSettings.pricing;
    const hasPublishedChanged = courseSettingsFormData.isPublished !== initialSettings.isPublished;
    
    setUserInteractedWithSettings({
      pricing: hasPricingChanged,
      isPublished: hasPublishedChanged,
    });
  }, [courseSettingsFormData]);

  // Function to check if Curriculum is complete (FIRST TAB)
  const isCurriculumComplete = () => {
    if (!courseCurriculumFormData || courseCurriculumFormData.length === 0) {
      return false;
    }
    
    // All lectures must have title, video URL, and public_id
    const allLecturesComplete = courseCurriculumFormData.every(lecture => 
      lecture.title?.trim() && 
      // Url?.trim() &&
      lecture.videoUrl?.trim() &&
      lecture.public_id?.trim()
    );
    
    return allLecturesComplete;
  };

  // Function to check if Landing Page is complete (SECOND TAB)
  const isLandingPageComplete = () => {
    if (!courseLandingFormData) return false;
    
    // Required fields for landing page (based on your config)
    const requiredFields = [
      'title',
      'description', 
      'category',
      'language',
      'level'
    ];
    
    // Check all required fields have values
    const hasRequiredFields = requiredFields.every(field => {
      const value = courseLandingFormData[field];
      return value && value.toString().trim().length > 0;
    });
    
    // Also check if image is uploaded (NOW IN LANDING PAGE)
    const hasImage = courseLandingFormData.image?.url && courseLandingFormData.image.url.trim().length > 0;
    
    return hasRequiredFields && hasImage;
  };

  // Function to check if Settings is complete (THIRD TAB)
  const isSettingsComplete = () => {
    if (!courseSettingsFormData) return false;
    
    // Pricing must be defined AND user must have interacted with it
    const hasPricing = courseSettingsFormData.pricing !== undefined && 
                       courseSettingsFormData.pricing !== null &&
                       userInteractedWithSettings.pricing;
    
    // Publication status must be defined AND user must have interacted with it
    const hasPublicationStatus = courseSettingsFormData.isPublished !== undefined &&
                                 userInteractedWithSettings.isPublished;
    
    return hasPricing && hasPublicationStatus;
  };

  // Function to check if all form sections are complete
  const isFormComplete = () => {
    return isCurriculumComplete() && 
           isLandingPageComplete() && 
           isSettingsComplete();
  };

  // Reset form after submission
  const resetForm = () => {
    setCourseLandingFormData({
      title: "",
      category: "",
      level: "",
      language: "",
      description: "",
      subtitle: "",
      detailedDescription: "",
      objective: "",
      welcomeMessage: "",
      image: {
        url: "",
        public_id: ""
      }
    });
    
    setCourseCurriculumFormData([]);
    setCourseSettingsFormData({
      pricing: 0,
      isPublished: false,
      accessType: "lifetime",
      hasCertificate: false,
      requirements: "",
    });
    
    setUserInteractedWithSettings({
      pricing: false,
      isPublished: false,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormComplete()) {
      const incompleteSections = [];
      if (!isCurriculumComplete()) incompleteSections.push("Curriculum");
      if (!isLandingPageComplete()) incompleteSections.push("Course Landing Page");
      if (!isSettingsComplete()) incompleteSections.push("Settings");
      
      alert(`Please complete the following sections:\n${incompleteSections.join('\n')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare course data for submission
      const courseData = {
        // Landing page data
        title: courseLandingFormData.title,
        subtitle: courseLandingFormData.subtitle || '',
        description: courseLandingFormData.description,
        detailedDescription: courseLandingFormData.detailedDescription || '',
        objective: courseLandingFormData.objective || '',
        welcomeMessage: courseLandingFormData.welcomeMessage || '',
        category: courseLandingFormData.category,
        level: courseLandingFormData.level,
        language: courseLandingFormData.language,
        
        // Image data (now in landing page)
        image: courseLandingFormData.image,
        
        // Curriculum data
        curriculum: courseCurriculumFormData.map((lecture, index) => ({
          ...lecture,
          order: index + 1
        })),
        
        // Settings data
        pricing: courseSettingsFormData.pricing,
        isPublished: courseSettingsFormData.isPublished,
        accessType: courseSettingsFormData.accessType || 'lifetime',
        hasCertificate: courseSettingsFormData.hasCertificate || false,
        requirements: courseSettingsFormData.requirements || '',
      };
      
      console.log("📤 Submitting course data:", courseData);
      
      // Call your API service to create course
      const response = await addNewCourseService(courseData);
      console.log("✅ Course created successfully:", response);
      
      // Show success message
      alert("Course created successfully!");
      
      // Reset form
      resetForm();
      
      // Navigate to courses list
      navigate("/instructor/courses");
      
    } catch (error) {
      console.error("❌ Error creating course:", error);
      alert(`Failed to create course: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tab completion status
  const getTabStatus = (tabId) => {
    switch(tabId) {
      case 'curriculum':
        return isCurriculumComplete();
      case 'landing':
        return isLandingPageComplete();
      case 'settings':
        return isSettingsComplete();
      default:
        return false;
    }
  };

  // Get tab display name
  const getTabDisplayName = (tabId) => {
    switch(tabId) {
      case 'curriculum':
        return "Curriculum";
      case 'landing':
        return "Course Landing Page";
      case 'settings':
        return "Settings";
      default:
        return tabId;
    }
  };

  // Get detailed status message for each tab
  const getTabStatusMessage = (tabId) => {
    switch(tabId) {
      case 'curriculum':
        if (!courseCurriculumFormData || courseCurriculumFormData.length === 0) 
          return "At least one lecture required";
        const incompleteLectures = courseCurriculumFormData.filter(lecture => 
          !lecture.title?.trim() || !lecture.videoUrl?.trim() || !lecture.public_id?.trim()
        );
        if (incompleteLectures.length > 0) 
          return `${incompleteLectures.length} lecture(s) incomplete`;
        return "Complete";
        
      case 'landing':
        if (!courseLandingFormData?.title?.trim()) return "Title required";
        if (!courseLandingFormData?.description?.trim()) return "Description required";
        if (!courseLandingFormData?.category?.trim()) return "Category required";
        if (!courseLandingFormData?.language?.trim()) return "Language required";
        if (!courseLandingFormData?.level?.trim()) return "Level required";
        if (!courseLandingFormData?.image?.url) return "Course image required";
        return "Complete";
        
      case 'settings':
        // Check if user has interacted with pricing
        const pricingValid = userInteractedWithSettings.pricing && 
                           courseSettingsFormData?.pricing !== undefined && 
                           courseSettingsFormData?.pricing !== null;
        
        // Check if user has interacted with publication status
        const publicationValid = userInteractedWithSettings.isPublished && 
                               courseSettingsFormData?.isPublished !== undefined;
        
        if (!pricingValid) return "Set pricing";
        if (!publicationValid) return "Choose publish status";
        return "Complete";
        
      default:
        return "Incomplete";
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/instructor/courses")}
          className="flex items-center gap-2 text-[#184EF0] hover:text-[#123fd0] transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Courses
        </button>
      </div>

      {/* Header + Submit */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Create New Course
        </h2>

        <button
          onClick={handleSubmit}
          disabled={!isFormComplete() || isSubmitting}
          className={`px-5 py-2 font-medium rounded-none shadow transition flex items-center gap-2 ${
            isFormComplete() && !isSubmitting
              ? "bg-[#184EF0] text-white hover:bg-[#123fd0] cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Creating...
            </>
          ) : (
            isFormComplete() ? "Submit Course" : "Complete All Fields"
          )}
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 p-4 bg-[#f8faff] border border-[#184EF0]/20 rounded-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Form Progress</span>
          <span className="text-sm font-bold text-[#184EF0]">
            {[
              isCurriculumComplete(),
              isLandingPageComplete(),
              isSettingsComplete()
            ].filter(Boolean).length}/3 sections complete
          </span>
        </div>
        <div className="flex gap-1 mb-2">
          {/* 1st bar: Curriculum */}
          <div 
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${isCurriculumComplete() ? 'bg-green-500' : 'bg-gray-200'}`}
            title={isCurriculumComplete() ? "Curriculum Complete" : "Curriculum Incomplete"}
          ></div>
          {/* 2nd bar: Landing Page */}
          <div 
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${isLandingPageComplete() ? 'bg-green-500' : 'bg-gray-200'}`}
            title={isLandingPageComplete() ? "Landing Page Complete" : "Landing Page Incomplete"}
          ></div>
          {/* 3rd bar: Settings */}
          <div 
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${isSettingsComplete() ? 'bg-green-500' : 'bg-gray-200'}`}
            title={isSettingsComplete() ? "Settings Complete" : "Settings Incomplete"}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{getTabStatusMessage('curriculum')}</span>
          <span>{getTabStatusMessage('landing')}</span>
          <span>{getTabStatusMessage('settings')}</span>
        </div>
      </div>

      {/* Tabs with completion indicators */}
      <div className="flex gap-4 border-b border-[#184EF0]/25 pb-2 mb-6">
        {["curriculum", "landing", "settings"].map((tab) => {
          const isTabComplete = getTabStatus(tab);
          const tabName = getTabDisplayName(tab);
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition flex items-center gap-2 relative ${
                activeTab === tab
                  ? "text-[#184EF0] border-b-2 border-[#184EF0]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tabName}
              {isTabComplete ? (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              ) : (
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              )}
              
              {/* Completion indicator tooltip */}
              {isTabComplete && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-none whitespace-nowrap">
                  ✓ Complete
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Box */}
      <div className="bg-white border border-[#184EF0]/20 rounded-none p-6 shadow-sm max-w-3xl">
        {activeTab === "curriculum" && <CurriculumTab />}
        {activeTab === "landing" && <LandingPageTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      {/* Incomplete sections warning */}
      {!isFormComplete() && (
        <div className="mt-6 p-4 bg-white border border-[#184EF0]/20 rounded-sm">
          <h3 className="font-medium text-[#184EF0] mb-2 flex items-center">
            <span className="mr-2">⚠️</span>
            Form Incomplete - Please complete all sections
          </h3>
          <ul className="text-sm text-[#333846] space-y-1">
            {!isCurriculumComplete() && (
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#333846] rounded-full mr-2 mt-1.5"></span>
                <div>
                  <strong>Curriculum:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    {(!courseCurriculumFormData || courseCurriculumFormData.length === 0) && 
                      <li>• At least one lecture is required</li>}
                    {courseCurriculumFormData && courseCurriculumFormData.some(lecture => !lecture.title?.trim()) && 
                      <li>• All lectures must have a title</li>}
                    {courseCurriculumFormData && courseCurriculumFormData.some(lecture => !lecture.videoUrl?.trim()) && 
                      <li>• All lectures must have a video</li>}
                    {courseCurriculumFormData && courseCurriculumFormData.some(lecture => !lecture.public_id?.trim()) && 
                      <li>• All lectures must be properly uploaded</li>}
                  </ul>
                </div>
              </li>
            )}
            {!isLandingPageComplete() && (
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#333846] rounded-full mr-2 mt-1.5"></span>
                <div>
                  <strong>Course Landing Page:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    {!courseLandingFormData?.title?.trim() && <li>• Title is required</li>}
                    {!courseLandingFormData?.description?.trim() && <li>• Description is required</li>}
                    {!courseLandingFormData?.category?.trim() && <li>• Category is required</li>}
                    {!courseLandingFormData?.language?.trim() && <li>• Language is required</li>}
                    {!courseLandingFormData?.level?.trim() && <li>• Level is required</li>}
                    {!courseLandingFormData?.image?.url && <li>• Course image is required</li>}
                  </ul>
                </div>
              </li>
            )}
            {!isSettingsComplete() && (
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#333846] rounded-full mr-2 mt-1.5"></span>
                <div>
                  <strong>Settings:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    {(!userInteractedWithSettings.pricing || courseSettingsFormData?.pricing === undefined || courseSettingsFormData?.pricing === null) && 
                      <li>• Pricing must be set (0 for free course)</li>}
                    {(!userInteractedWithSettings.isPublished || courseSettingsFormData?.isPublished === undefined) && 
                      <li>• Publication status must be selected</li>}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Bottom submit button for mobile */}
      <div className="sticky bottom-0 bg-white border-t py-4 mt-6 md:hidden">
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete() || isSubmitting}
          className={`w-full px-5 py-3 font-medium rounded-none shadow transition flex items-center justify-center gap-2 ${
            isFormComplete() && !isSubmitting
              ? "bg-[#184EF0] text-white hover:bg-[#123fd0] cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Creating...
            </>
          ) : (
            isFormComplete() ? "Submit Course" : "Complete All Fields to Submit"
          )}
        </button>
      </div>
    </div>
  );
}
