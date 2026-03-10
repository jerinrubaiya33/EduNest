// config/index.jsx
// / Sign up form controls
export const signUpFormControls = [
  { 
    name: "username", 
    label: "User Name",
    placeholder: "Enter your user name", 
    type: "text", 
    componentType: "input"
  },
  { 
    name: "email", 
    label: "User Email", 
    placeholder: "Enter your user email", 
    type: "email", 
    componentType: "input" 
  },
  { 
    name: "password", 
    label: "Password", 
    placeholder: "Enter your password", 
    type: "password", 
    componentType: "input" 
  },
];

// Language options
export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
];

// Course levels
export const courseLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

// Course categories
export const courseCategories = [
  { id: "web-development", label: "Web Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "cyber-security", label: "Cyber Security" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "game-development", label: "Game Development" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "database", label: "Database" },
  { id: "python", label: "Python" },
];

// Course landing page form controls
export const courseLandingPageFormControls = [
  { 
    name: "title", 
    label: "Title", 
    componentType: "input", 
    type: "text", 
    placeholder: "Enter course title" 
  },
  { 
    name: "category", 
    label: "Category", 
    componentType: "select", 
    placeholder: "Select course category", 
    options: courseCategories 
  },
  { 
    name: "level", 
    label: "Level", 
    componentType: "select", 
    placeholder: "Select course level", 
    options: courseLevels 
  },
  { 
    name: "description", 
    label: "Short Description", 
    componentType: "textarea", 
    placeholder: "Enter a brief description of the course" 
  },
  { 
    name: "language", 
    label: "Language", 
    componentType: "select", 
    placeholder: "Select course language", 
    options: languageOptions 
  },
  { 
    name: "subtitle", 
    label: "Subtitle", 
    componentType: "input", 
    type: "text", 
    placeholder: "Enter course subtitle" 
  },
  { 
    name: "detailedDescription", 
    label: "Detailed Description", 
    componentType: "textarea", 
    placeholder: "Enter detailed description for the course" 
  },
  { 
    name: "objective", 
    label: "Objective", 
    componentType: "textarea", 
    placeholder: "Enter the main objectives of this course" 
  },
  { 
    name: "welcomeMessage", 
    label: "Welcome Message", 
    componentType: "textarea", 
    placeholder: "Write a welcome message for your students" 
  },
];

// Initial form data for course landing
export const courseLandingInitialFormData = {
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
  },
  pricing: "",
  courseImage: null,
};
// Course Curriculum Initial Form Data (ARRAY!)
export const courseCurriculumInitialFormData = [];

// Course Settings Initial Form Data
export const courseSettingsInitialFormData = {
  pricing: 0,
  isPublished: false,
  accessType: "lifetime",
  hasCertificate: false,
  requirements: "",
};
