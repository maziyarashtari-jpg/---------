import React, { useState, useMemo } from "react";
import { MATERIALS_GUIDE } from "../data/as568";
import { MaterialProps } from "../types";
import { ListChecks, Flame, ShieldAlert, BadgeCheck, Compass } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MaterialGuide() {
  const { lang, t, colors } = useApp();
  const materials = useMemo(() => MATERIALS_GUIDE, []);
  
  // Set default material NBR
  const [selectedMat, setSelectedMat] = useState<MaterialProps>(materials[0]);

  // English material mapping for high quality professional UI
  const engMaterials: Record<string, Partial<MaterialProps>> = {
    "NBR (Nitrile Butadiene Rubber)": {
      name: "NBR (Nitrile Butadiene Rubber)",
      persianName: "NBR Elastomer (Nitrile / Buna-N)",
      description: "The most popular and cost-effective elastomer in the fluid power industry. Features exceptional resistance to petroleum-based hydraulic fluids, mineral oils, water, and silicone greases.",
      advantages: [
        "Excellent compatibility with mineral oils and hydrocarbon fuels",
        "High mechanical durability and superior wear abrasion index",
        "Highly affordable and widely stocked worldwide"
      ],
      disadvantages: [
        "Poor resistance to ozone weather patterns, sunlight, and atmospheric UV rays",
        "Vulnerable to polar organic solvents like Acetone, MEK, and ethyl alcohol",
        "Strict temperature limitations (Maximum safe operating heat limit is 120°C)"
      ],
      applications: "Widely selected for general industrial machinery, pumps, control valves, fluid filter housings, and general pneumatic line fittings."
    },
    "FKM (Viton / Fluorocarbon)": {
      name: "FKM (Viton / Fluorocarbon)",
      persianName: "Viton Fluorocarbon (FKM)",
      description: "A premium fluoropolymer elastomer offering outstanding thermal ratings and broad chemical inertness. Resists acidic liquids, aggressive fuels, and highly aromatic petroleum solvents with ease.",
      advantages: [
        "Superior heat resilience standing up to 200°C continuous service",
        "Great resistance to strong acid elements, aromatics, chlorinated hydrocarbons",
        "Exceptional longevity and chemical decay proofing against UV, ozone and weather ageing"
      ],
      disadvantages: [
        "Becomes rigid and loses elasticity in deep cold environments below -20°C",
        "High premium pricing compared to Nitrile or VMQ silicon rubber",
        "Prone to structural swelling in hyper-heated steam cycles or ammonia gas systems"
      ],
      applications: "Heavily utilized in petrochemical refineries, oil field exploration tools, motor manifold gaskets, and fuel injector valves."
    },
    "Silicone (VMQ)": {
      name: "Silicone (VMQ)",
      persianName: "Silicone Elastomer (VMQ)",
      description: "Excellent cold adaptability and thermal stability. Biologically inert, odorless, and highly hygienic, making it ideal for food, medical, and cosmetics packaging applications.",
      advantages: [
        "Vast operating temperature envelope going from -60°C to +220°C",
        "Fulfills FDA grade requirements for medical devices and food processing contact",
        "Highly stable dielectric barrier and superior ozone/oxygen aging performance"
      ],
      disadvantages: [
        "Fails in mechanical tear strength test runs under physical stress load",
        "Abysmal wear index (Strongly discouraged in dynamic reciprocating rod shafts)",
        "Vulnerable to continuous steam ingress and high gas diffusion permeability"
      ],
      applications: "Used heavily in life-science medical gears, sterile lab tools, baker ovens, beverage bottle seals, and circuit insulation jackets."
    },
    "EPDM (Ethylene Propylene)": {
      name: "EPDM (Ethylene Propylene)",
      persianName: "EPDM Synthetics (Ethylene Propylene)",
      description: "Famous for outstanding outdoor atmospheric durability and steam resistance. Widely specified for brakes, cooling systems, and chemical processing rigs.",
      advantages: [
        "Superior resistance to heat-aging, weathering, sunlight, and extreme ozone",
        "Highly resilient in hot water, steam, polar organic solvents, and glycol brake fluids",
        "Good tensile and shear resilience"
      ],
      disadvantages: [
        "Swells severely in petroleum-based minerals, grease lubes, and motor fuels",
        "Strictly uncooperative with aromatic hydrocarbons",
        "Slow assembly startup when lubrication demands mineral greases"
      ],
      applications: "Vehicle cooling hoses, brake master cylinder seals, atmospheric weatherstripping, solar panel collectors, and water filtration manifolds."
    }
  };

  // Get active translation based on language
  const activeMat = useMemo(() => {
    if (lang === "en" && engMaterials[selectedMat.name]) {
      return {
        ...selectedMat,
        ...engMaterials[selectedMat.name]
      };
    }
    return selectedMat;
  }, [lang, selectedMat]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="material-guide-module">
      
      {/* Right column: Material Selectors as cards */}
      <div className="lg:col-span-4 space-y-3 text-start" id="material-pickers">
        <h3 className="text-base font-black mb-2 flex items-center gap-2 px-1">
          <Compass className="w-5 h-5 text-blue-600" />
          {lang === "fa" ? "خواص فیزیکی و شیمیایی الاستومرها" : "Elastomer Chemical Compatibility"}
        </h3>
        
        {materials.map((m) => {
          const isSelected = selectedMat.name === m.name;
          const labelTitle = lang === "fa" ? m.persianName.split(" (")[0] : m.name.split(" (")[0];
          const labelDesc = lang === "fa" ? m.description : (engMaterials[m.name]?.description || m.description);
          
          return (
            <button
              id={`material-btn-${m.name}`}
              key={m.name}
              onClick={() => setSelectedMat(m)}
              className={`w-full text-start p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-blue-500/10 border-blue-400 shadow-3xs"
                  : `${colors.cardBg} ${colors.cardBorder} hover:border-slate-400`
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] text-slate-400">
                  {m.minTemp}°C to {m.maxTemp}°C
                </span>
                <strong className={`text-xs ${isSelected ? "text-blue-500 font-bold" : ""}`}>
                  {labelTitle}
                </strong>
              </div>
              
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {labelDesc}
              </p>
              
              <div className="flex items-center gap-1.5 justify-start mt-3">
                <span className={`text-[9px] font-mono ${colors.badgeBg} ${colors.badgeText} px-2.5 py-0.5 rounded border border-slate-350`}>
                  {lang === "fa" ? `سختی: ${m.hardness.split(" ")[0]} Shore A` : `Hardness: ${m.hardness}`}
                </span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded">
                  {m.name.split(" (")[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Left column: Full technical specification of selected material */}
      <div className={`lg:col-span-8 ${colors.cardBg} p-6 rounded-2xl border ${colors.cardBorder} shadow-xs text-start space-y-6`} id="material-sheet">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b ${colors.cardBorder} pb-4">
          <div className="flex items-center gap-1">
            <span className={`bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] px-2.5 py-1 rounded-md font-bold font-mono border border-blue-500/20`}>
              {activeMat.hardness}
            </span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-blue-600 dark:text-blue-405 flex items-center gap-2 justify-end">
              {activeMat.persianName}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeMat.name}</p>
          </div>
        </div>

        {/* Temperature Gauge Thermometer */}
        <div className={`${colors.inputBg} p-5 rounded-2xl border ${colors.cardBorder} space-y-3`}>
          <h4 className="text-xs font-bold flex items-center gap-1.5 justify-start">
            <Flame className="w-4 h-4 text-blue-650" />
            {lang === "fa" ? "بازه کارکرد دمایی ایمن مداوم" : "Safe continuous operating temperature range"}
          </h4>
          
          {/* Visual thermometer gauge bar */}
          <div className="relative pt-6">
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative animate-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500 opacity-20" />
              {(() => {
                const totalRange = 400; // -100C to 300C is 400 span
                const startPercent = ((activeMat.minTemp - (-100)) / totalRange) * 100;
                const widthPercent = ((activeMat.maxTemp - activeMat.minTemp) / totalRange) * 100;
                return (
                  <div
                    className="absolute h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
                  />
                );
              })()}
            </div>
            
            {/* Legend scale labels */}
            <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-mono scrollbar-none overflow-x-auto gap-1">
              <span>-100°C</span>
              <span>-50°C</span>
              <span>0°C</span>
              <span>+50°C</span>
              <span>+100°C</span>
              <span>+150°C</span>
              <span>+200°C</span>
              <span>+250°C</span>
              <span>+300°C</span>
            </div>

            {/* Gauge indicators */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-2 border ${colors.cardBorder} rounded-xl mt-3 text-xs">
              <div className="text-start font-mono">
                <span className="text-[10px] text-slate-400 block text-start font-sans">{lang === "fa" ? "کمترین دمای مجاز" : "Cold Limit"}</span>
                <strong className="text-blue-600 text-sm font-bold">{activeMat.minTemp}°C</strong>
              </div>
              <div className="h-5 w-px bg-slate-250 bg-slate-200" />
              <div className="text-start font-mono">
                <span className="text-[10px] text-slate-400 block text-start font-sans">{lang === "fa" ? "بیشترین دمای مجاز" : "Heat Limit"}</span>
                <strong className="text-rose-600 text-sm font-bold">+{activeMat.maxTemp}°C</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed compatibility description */}
        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 font-sans">
          {activeMat.description}
        </p>

        {/* Pros & Cons list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          {/* Advantages */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 border-b border-emerald-500/10 pb-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              {lang === "fa" ? "مزایا و مقاومت‌ها" : "Chemical Compatibility & Strengths"}
            </h4>
            <ul className="space-y-1.5 font-sans text-start">
              {activeMat.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-1 justify-start">
                  <span className="text-emerald-555 text-emerald-600 font-bold block shrink-0 mr-1">✓</span>
                  <span className="text-slate-600 dark:text-slate-300 text-[11px]">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disadvantages */}
          <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-rose-800 dark:text-rose-300 text-xs flex items-center gap-1.5 border-b border-rose-500/10 pb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 opacity-90" />
              {lang === "fa" ? "عدم پایداری و محدودیت‌ها" : "Chemical Vulnerability & Weaknesses"}
            </h4>
            <ul className="space-y-1.5 font-sans text-start">
              {activeMat.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-1 justify-start">
                  <span className="text-rose-500 font-bold block shrink-0 mr-1">✗</span>
                  <span className="text-slate-605 text-slate-600 dark:text-slate-300 text-[11px]">{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic application advice */}
        <div className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.inputBg} text-xs space-y-1 text-start`}>
          <span className="font-bold block">{lang === "fa" ? "کاربرد عمومی در صنایع و اتصالات:" : "General Industrial End-use & Seals Designation:"}</span>
          <p className="text-slate-500 dark:text-slate-400 leading-normal text-[11px]">
            {activeMat.applications}
          </p>
        </div>

      </div>
    </div>
  );
}
