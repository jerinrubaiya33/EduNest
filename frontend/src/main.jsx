// main.jsx
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { AuthProvider } from './context/auth-context/AuthContext'
// import InstructorProvider from './context/instructor-context'
// import { StudentContextProvider } from './context/student-context'
// // import AuthProvider from './context/auth-context/AuthContext'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>

//     <AuthProvider>
//       <InstructorProvider>
//         <StudentContextProvider>
//           <App/>
//         </StudentContextProvider>
//       </InstructorProvider>
//     </AuthProvider>

//   </BrowserRouter>
// )




//main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context/AuthContext";
import InstructorProvider from "./context/instructor-context";
import StudentProvider from "./context/student-context";
import { LangProvider } from "./context/lang-context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <LangProvider>
            <App />
          </LangProvider>
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>,
);
