import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Microscope, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context/AuthContext";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { handleRegisterUser, handleLoginUser } = useAuth();
  const navigate = useNavigate();

  function handleTabChange(value) {
    setActiveTab(value);
    if (value === "signin") {
      setSignupData({ name: "", email: "", password: "" });
    } else {
      setSigninData({ email: "", password: "" });
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const result = await handleRegisterUser(signupData);
    if (!result.success) {
      alert(result.message);
      return;
    }
    alert("Account created successfully!");
    setActiveTab("signin");
    setSignupData({ name: "", email: "", password: "" });
  }

  async function handleSignIn(e) {
    e.preventDefault();
    const result = await handleLoginUser(signinData.email, signinData.password);
    if (!result.success) {
      alert(result.message);
      return;
    }
    alert("Logged in!");
    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen font-caveat3 bg-gradient-to-br from-[#f6f8ff] via-white to-[#fff6ef]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #228BE60d 1px, transparent 1px), linear-gradient(to bottom, #228BE60d 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <header className="border-b  border-[#e8660f]/15 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Image */}
          <Link to="/" className="flex items-center shrink-0 py-4">
            <img
              src="/edu_logo.png"
              alt="EduNest Logo"
              className="h-8 w-auto object-contain"
            />
            <p className="text-xl font-medium text-[#2D3748] ml-2">Edu<span className="text-[#228BE6]">Nest<span className="text-[#e8660f]">
              .</span> </span></p>
          </Link>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#228BE6] sm:block">
            Learn. Build. Grow.
          </span>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
        <section className="lg:col-span-6 -mt-8">
          <div className="border border-[#e8660f]/15 bg-white p-8 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#228BE6]">
              Student Portal
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
              Welcome back to your learning journey
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              Access expert-led courses, track your progress, and unlock your
              next skill milestone with EduNest.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 border border-slate-200 bg-[#f8fbff] px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-[#228BE6]" />
                <p className="text-sm font-medium text-slate-700">
                  Secure login with account protection
                </p>
              </div>
              <div className="flex items-center gap-3 border border-slate-200 bg-[#fffaf4] px-4 py-3">
                <Sparkles className="h-4 w-4 text-[#e8660f]" />
                <p className="text-sm font-medium text-slate-700">
                  Personalized recommendations and offers
                </p>
              </div>
              <div className="flex items-center gap-3 border border-slate-200 bg-[#f8fbff] px-4 py-3">
                <Users className="h-4 w-4 text-[#228BE6]" />
                <p className="text-sm font-medium text-slate-700">
                  Join a growing learner community
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-6 -mt-0">
          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-2 border border-[#e8660f]/20 p-1">
              <button
                type="button"
                onClick={() => handleTabChange("signin")}
                className={`h-10 text-sm font-semibold transition ${activeTab === "signin"
                    ? "bg-[#e8660f] text-white"
                    : "bg-white text-[#e8660f]"
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("signup")}
                className={`h-10 text-sm font-semibold transition ${activeTab === "signup"
                    ? "bg-[#e8660f] text-white"
                    : "bg-white text-[#e8660f]"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "signin" ? (
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signinData.email}
                    onChange={(e) =>
                      setSigninData({ ...signinData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#e8660f]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signinData.password}
                    onChange={(e) =>
                      setSigninData({ ...signinData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#e8660f]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center bg-[#e8660f] text-sm font-bold text-white transition hover:bg-[#e8660f]/90"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#e8660f]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#e8660f]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    placeholder="Create password"
                    className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#e8660f]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center bg-[#e8660f] text-sm font-bold text-white transition hover:bg-[#ea6a0e]"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuthPage;
