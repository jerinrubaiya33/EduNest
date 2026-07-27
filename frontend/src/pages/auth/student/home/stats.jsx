import {
  BrainCircuit,
  BadgeCheck,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const statsItems = [
 {
  icon: BrainCircuit,
  title: "Build Your",
  subtitle: "Core Knowledge",
},
{
  icon: BadgeCheck,
  title: "Gain Recognized",
  subtitle: "Certifications",
},
{
  icon: BriefcaseBusiness,
  title: "Prepare for Your",
  subtitle: "Dream Career",
},
{
  icon: Sparkles,
  title: "Explore and Excel",
  subtitle: "Across Fields",
},
];

export default function Stats() {
  return (
    <section className="relative mb-120 mt-0 ml-40 sm:ml-124 right-1/2 -mx-[50vw] w-screen bg-[#1877d9] ">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 text-white sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {statsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.subtitle}
                className="flex items-center gap-4 border-white/15 sm:border-r-0 lg:border-r lg:pr-6 last:border-r-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center ">
                  <Icon className="h-9 w-9 stroke-[1.5]" />
                </div>

                <div>
                  <p className="text-[0.98rem] font-medium leading-tight">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.98rem] font-medium leading-tight">
                    {item.subtitle}
                  </p>
                  <div className="mt-2 h-px w-12 bg-white/35 sm:hidden" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
