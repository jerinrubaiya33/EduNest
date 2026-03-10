import React from "react";
import { useNavigate } from "react-router-dom";
import { Construction } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eaf6f6] px-6">

      {/* Atmosphere layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,#fff8ee_0%,transparent_60%),radial-gradient(60%_50%_at_80%_0%,#ffe9d1_0%,transparent_55%),radial-gradient(50%_50%_at_50%_100%,#f2e7d6_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center">
        <div className="w-full rounded-3xl border border-black/5 bg-white/70 p-10 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Left content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-200/60 bg-amber-50/70 px-4 py-2 text-amber-900/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Construction className="h-4 w-4 text-amber-600" />
                </span>
                <span className="text-xs font-semibold tracking-[0.2em]">
                  UNDER CONSTRUCTION
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05] text-[#2b2621]">
                This corner is still being polished.
              </h1>

              <p className="mt-4 max-w-xl text-base font-not sm:text-lg text-[#5b534c]">
                The page you’re looking for isn’t ready yet. We’re shaping it with care.
                Until then, head back to a fully finished space.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="relative w-[190px] h-[54px]">
                  {/* Overlay text */}
                  <div className="pointer-events-none absolute inset-0 z-10 flex -ml-2.5 -mt-1 h-full w-full items-center justify-center text-center text-sm font-semibold leading-none tracking-wide text-white">
                    Back to Home
                  </div>

                  {/* Animated button */}
                  <div className="absolute inset-0 [&_p]:opacity-0">
                    <AnimatedButton onClick={() => navigate("/")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="relative hidden lg:block">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-amber-200/60 blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 right-6 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl animate-pulse" />

              <div className="relative rounded-2xl border border-black/5 bg-gradient-to-br from-white to-amber-50 p-8 shadow-[0_15px_50px_-30px_rgba(0,0,0,0.4)]">
                <div className="text-xs uppercase tracking-[0.3em] text-[#9b8572]">
                  Error Code
                </div>

                <div className="mt-4 text-7xl font-caveat font-semibold text-[#2b2621]">
                  404
                </div>

                <div className="mt-4 text-sm text-[#6b5f55]">
                  Try visiting the homepage or going back to the previous screen.
                </div>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                <div className="mt-6 flex items-center gap-3 text-sm text-[#6b5f55]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Construction className="h-4 w-4" />
                  </span>
                  We’re building something worth the wait.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
