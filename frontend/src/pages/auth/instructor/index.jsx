import { useAuth } from "@/context/auth-context/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  GraduationCap,
  User,
  LogOut,
  BookOpen,
  DollarSign,
  BarChart2,
  PlusCircle,
} from "lucide-react";

export default function InstructorDashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const menu = [
    { name: "Manage Courses", icon: BookOpen, path: "/instructor/courses" },
    { name: "Students", icon: User, path: "/instructor/students" },
    { name: "Earnings", icon: DollarSign, path: "/instructor/earnings" },
    { name: "Analytics", icon: BarChart2, path: "/instructor/analytics" },
    { name: "New Course", icon: PlusCircle, path: "/instructor/create-course" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white backdrop-blur-md shadow-sm border-b border-[#184EF0]/15 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-[#F97316]" />
          <span className="font-semibold text-2xl sm:text-xl tracking-tight">
            Edu<span className="text-[#F97316]">Nest</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-700 text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-[#184EF0]" /> {currentUser?.name}
          </span>

          <button
            onClick={logout}
            className="px-4 py-1.5 bg-[#184EF0] text-white rounded-sm shadow hover:bg-[#123fd0] transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#184EF0]/15 px-4 py-6">
          <nav className="flex flex-col gap-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition border 
                  ${
                    active
                      ? "bg-[#184EF0]/10 border-[#184EF0]/30"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-[#184EF0]" : "text-[#F97316]"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      active ? "text-[#184EF0]" : "text-slate-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
