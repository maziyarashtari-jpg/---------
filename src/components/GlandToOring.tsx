import React, { useState, useMemo } from "react";
import { getAS568Dimensions, GLAND_DESIGN_RECOMMENDATIONS } from "../data/as568";
import { ORingDimension } from "../types";
import { 
  Sliders, 
  Settings2, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Ruler, 
  Activity, 
  ArrowRightLeft, 
  ChevronRight,
  Hammer
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function GlandToOring() {
  const { lang, t, colors } = useApp();
  const [unit, setUnit] = useState<"mm" | "inch">("mm");
  const [glandType, setGlandType] = useState<"piston" | "rod">("piston");
  const [motionType, setMotionType] = useState<"static" | "dynamic">("static");
  
  // Numerical Inputs stored as raw strings for friendly typing
  const [grooveDia, setGrooveDia] = useState<string>("25.00");
  const [grooveDepth, setGrooveDepth] = useState<string>("2.10");
  const [grooveWidth, setGrooveWidth] = useState<string>("3.60");

  const oRingsList = useMemo(() => getAS568Dimensions(), []);
  const glandsRecommendations = useMemo(() => GLAND_DESIGN_RECOMMENDATIONS, []);

  // Parse numerical choices
  const parsedInputs = useMemo(() => {
    const gd = parseFloat(grooveDia) || 0;
    const h = parseFloat(grooveDepth) || 0;
    const b = parseFloat(grooveWidth) || 0;

    // Normalize to mm for calculations
    const gdMm = unit === "mm" ? gd : gd * 25.4;
    const hMm = unit === "mm" ? h : h * 25.4;
    const bMm = unit === "mm" ? b : b * 25.4;

    return {
      gd,
      h,
      b,
      gdMm,
      hMm,
      bMm
    };
  }, [grooveDia, grooveDepth, grooveWidth, unit]);

  // Matching algorithm
  const matches = useMemo(() => {
    const { gdMm, hMm, bMm } = parsedInputs;
    if (gdMm <= 0 || hMm <= 0) return [];

    // Calculate corresponding assembly dimension
    // Piston: O-ring sits in groove on shaft. Bore dia = groove + 2 * h. O-ring ID stretches onto groove.
    // Rod: O-ring sits in housing groove. Shaft dia = groove - 2 * h. O-ring ID is matched to rod.
    const calculatedBoreOrShaftMm = glandType === "piston" 
      ? gdMm + (2 * hMm) 
      : gdMm - (2 * hMm);

    const candidates = oRingsList.map((o) => {
      // Squeeze ratio
      const squeezeRatio = Number(((o.csMm - hMm) / o.csMm * 100).toFixed(1));
      
      // Stretch / Interference ratio
      let stretchRatio = 0;
      if (glandType === "piston") {
        // Piston: O-ring stretched over the groove diameter (gdMm)
        stretchRatio = Number(((gdMm - o.idMm) / o.idMm * 100).toFixed(1));
      } else {
        // Rod: O-ring snugged onto rod diameter (calculatedBoreOrShaftMm)
        stretchRatio = Number(((calculatedBoreOrShaftMm - o.idMm) / o.idMm * 100).toFixed(1));
      }

      // Check ideal squeeze/stretch scores to rank
      const idealSqueeze = motionType === "static" ? 22 : 14; 
      const idealStretch = glandType === "piston" ? 2.5 : 0; 

      // Squeeze mismatch penalty
      const squeezePenalty = Math.abs(squeezeRatio - idealSqueeze);
      // Stretch mismatch penalty
      const stretchPenalty = Math.abs(stretchRatio - idealStretch);

      // Total scoring index (lower is better)
      // CS match plays a heavy structural role so we find the closest standard CS first
      let closestRec = glandsRecommendations[0];
      let minCsDiff = Infinity;
      glandsRecommendations.forEach(rec => {
        const diff = Math.abs(rec.csMm - o.csMm);
        if (diff < minCsDiff) {
          minCsDiff = diff;
          closestRec = rec;
        }
      });

      // Depth mismatch with standard recommended depth for this CS
      const standardDepthAvg = motionType === "static"
        ? (parseFloat(closestRec.staticPistonDepth.split(" to ")[0]) + parseFloat(closestRec.staticPistonDepth.split(" to ")[1])) / 2
        : (parseFloat(closestRec.dynamicPistonDepth.split(" to ")[0]) + parseFloat(closestRec.dynamicPistonDepth.split(" to ")[1])) / 2;
      
      const csDepthPenalty = Math.abs(o.csMm - (hMm / (standardDepthAvg / closestRec.csMm)));

      // Combined penalty score
      const totalScore = (csDepthPenalty * 30) + (squeezePenalty * 1.5) + (stretchPenalty * 1.0);

      return {
        oRing: o,
        squeezeRatio,
        stretchRatio,
        closestRec,
        standardDepthAvg,
        score: totalScore
      };
    });

    // Sort by smallest score and return top results
    return candidates.sort((a, b) => a.score - b.score).slice(0, 5);
  }, [parsedInputs, glandType, motionType, oRingsList, glandsRecommendations]);

  const topMatch = matches[0];
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number>(0);
  const activeMatch = matches[selectedMatchIdx] || topMatch;

  // Reset selected matches index when search parameters change
  React.useEffect(() => {
    setSelectedMatchIdx(0);
  }, [grooveDia, grooveDepth, grooveWidth, unit, glandType, motionType]);

  const handleUnitToggle = () => {
    if (unit === "mm") {
      setUnit("inch");
      setGrooveDia((prev) => (Number(prev) / 25.4).toFixed(3));
      setGrooveDepth((prev) => (Number(prev) / 25.4).toFixed(3));
      setGrooveWidth((prev) => (Number(prev) / 25.4).toFixed(3));
    } else {
      setUnit("mm");
      setGrooveDia((prev) => (Number(prev) * 25.4).toFixed(2));
      setGrooveDepth((prev) => (Number(prev) * 25.4).toFixed(2));
      setGrooveWidth((prev) => (Number(prev) * 25.4).toFixed(2));
    }
  };

  const getRatingBadge = (val: number, type: "squeeze" | "stretch") => {
    if (type === "squeeze") {
      if (val >= 12 && val <= 32) {
        return {
          label: lang === "fa" ? "فشردگی عالی" : "Optimal Squeeze",
          color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        };
      }
      if (val >= 8 && val < 12) {
        return {
          label: lang === "fa" ? "فشردگی نسبتاً کم" : "Moderate Squeeze",
          color: "bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300"
        };
      }
      if (val > 32 && val <= 40) {
        return {
          label: lang === "fa" ? "فشردگی زیاد" : "High Squeeze",
          color: "bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300"
        };
      }
      return {
        label: lang === "fa" ? "غیرمجاز (خطر نشتی/له‌شدگی)" : "Unacceptable Squeeze",
        color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
      };
    } else {
      if (val >= -1 && val <= 5) {
        return {
          label: lang === "fa" ? "کشش کاملاً استاندارد" : "Perfect Stretch",
          color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        };
      }
      if (val > 5 && val <= 10) {
        return {
          label: lang === "fa" ? "کشش بالا (مستهلک‌کننده)" : "Excessive Pull",
          color: "bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300"
        };
      }
      if (val < -1 && val >= -5) {
        return {
          label: lang === "fa" ? "میدان لقی (نیاز به گیره)" : "Slight Backlash",
          color: "bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300"
        };
      }
      return {
        label: lang === "fa" ? "تفاوت قطر بحرانی" : "Critical Gap Difference",
        color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
      };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gland-to-oring-module">
      {/* Right Column: User parameters input */}
      <div className="lg:col-span-5 space-y-6" id="gland-parameters-panel">
        <div className={`${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-xs text-start`}>
          <div className="flex justify-between items-center mb-5">
            <button
              id="g2o-unit-toggle"
              type="button"
              onClick={handleUnitToggle}
              className="flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
            >
              <ArrowRightLeft className="w-3" />
              {t("unitToggleTo")} {unit === "mm" ? t("inch") : t("mm")}
            </button>
            <h3 className="text-base font-black flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-blue-600" />
              {lang === "fa" ? "ورود پارامترهای فیزیکی شیار" : "Custom Gland Definition"}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Sealing Joint Nature Switcher */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                {lang === "fa" ? "نوع کاربری و حرکت مفصل" : "Sealing Joint Dynamics"}
              </label>
              <div className={`grid grid-cols-2 gap-1.5 p-1 ${colors.inputBg} border ${colors.cardBorder} rounded-xl`}>
                <button
                  type="button"
                  onClick={() => setMotionType("static")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    motionType === "static"
                      ? "bg-white dark:bg-slate-900 border shadow-3xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang === "fa" ? "ثابت (Static)" : "Static (Stationary)"}
                </button>
                <button
                  type="button"
                  onClick={() => setMotionType("dynamic")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    motionType === "dynamic"
                      ? "bg-white dark:bg-slate-900 border shadow-3xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang === "fa" ? "متحرک (Dynamic)" : "Dynamic (Sliding)"}
                </button>
              </div>
            </div>

            {/* Groove architecture type */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                {lang === "fa" ? "مکانیزم هوزینگ تراشکاری" : "Groove Configuration Position"}
              </label>
              <div className={`grid grid-cols-2 gap-1.5 p-1 ${colors.inputBg} border ${colors.cardBorder} rounded-xl`}>
                <button
                  type="button"
                  onClick={() => setGlandType("rod")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    glandType === "rod"
                      ? "bg-white dark:bg-slate-900 border shadow-3xs"
                      : "text-slate-400 hover:text-slate-205"
                  }`}
                >
                  {lang === "fa" ? "داخل پوسته (Rod)" : "Internal (Rod In-Cavity)"}
                </button>
                <button
                  type="button"
                  onClick={() => setGlandType("piston")}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    glandType === "piston"
                      ? "bg-white dark:bg-slate-900 border shadow-3xs"
                      : "text-slate-400 hover:text-slate-205"
                  }`}
                >
                  {lang === "fa" ? "روی شفت (Piston)" : "External (Piston On-Shaft)"}
                </button>
              </div>
            </div>

            {/* Input Groove Base Diameter */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                {glandType === "piston" 
                  ? (lang === "fa" ? "قطر کف شیار روی شفت" : "Shaft Groove Base Diameter") 
                  : (lang === "fa" ? "قطر کف شیار داخل سیلندر" : "Housing Groove Outer Diameter")} ({unit === "mm" ? t("mm") : t("inch")})
              </label>
              <div className="relative">
                <input
                  id="groove-dia-input"
                  type="number"
                  step="0.01"
                  className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-3 font-mono text-xs outline-none transition-all`}
                  value={grooveDia}
                  onChange={(e) => setGrooveDia(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                  {unit === "mm" ? "mm" : "inch"}
                </span>
              </div>
            </div>

            {/* Input Groove Depth */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                {lang === "fa" ? "عمق خالص شعاعی شیار (h)" : "Radial Groove Cut Depth (h)"} ({unit === "mm" ? t("mm") : t("inch")})
              </label>
              <div className="relative">
                <input
                  id="groove-depth-input"
                  type="number"
                  step="0.01"
                  className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-3 font-mono text-xs outline-none transition-all`}
                  value={grooveDepth}
                  onChange={(e) => setGrooveDepth(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                  {unit === "mm" ? "mm" : "inch"}
                </span>
              </div>
            </div>

            {/* Input Groove Width */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                {lang === "fa" ? "پهنای کل شیار (b)" : "Groove Opening Width (b)"} ({unit === "mm" ? t("mm") : t("inch")}) <span className="text-[9px] text-slate-400">({lang === "fa" ? "اختیاری" : "Optional"})</span>
              </label>
              <div className="relative">
                <input
                  id="groove-width-input"
                  type="number"
                  step="0.01"
                  className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-3 font-mono text-xs outline-none transition-all`}
                  value={grooveWidth}
                  onChange={(e) => setGrooveWidth(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                  {unit === "mm" ? "mm" : "inch"}
                </span>
              </div>
            </div>
          </div>

          {/* Geometry telemetry summary card */}
          <div className={`border-t ${colors.cardBorder} pt-4 mt-5 space-y-2 text-xs`}>
            <span className="text-slate-400 block mb-1 font-medium">{lang === "fa" ? "ابعاد هندسی هم‌تراز سیستم:" : "System Reconstructed Boundaries:"}</span>
            <div className="grid grid-cols-2 gap-3">
              <div className={`${colors.inputBg} p-2.5 rounded-lg border ${colors.cardBorder}`}>
                <span className="text-slate-400 block text-[9px] mb-0.5">
                  {glandType === "piston" 
                    ? (lang === "fa" ? "قطر اسمی بدنه سوراخ سیلندر" : "Piston Bore Diameter") 
                    : (lang === "fa" ? "قطر شفت متصل نشیمن" : "Rod Slider Diameter")}
                </span>
                <strong className="font-mono text-xs">
                  {parsedInputs.gdMm > 0 && parsedInputs.hMm > 0 ? (
                    glandType === "piston" 
                      ? `${(parsedInputs.gdMm + 2 * parsedInputs.hMm).toFixed(2)} mm` 
                      : `${(parsedInputs.gdMm - 2 * parsedInputs.hMm).toFixed(2)} mm`
                  ) : "..."}
                </strong>
              </div>
              <div className={`${colors.inputBg} p-2.5 rounded-lg border ${colors.cardBorder}`}>
                <span className="text-slate-400 block text-[9px] mb-0.5">{lang === "fa" ? "مقطع پیشنهادی اورینگ" : "Matched CS Target"}</span>
                <strong className="font-mono text-xs">
                  {parsedInputs.hMm > 0 ? `CS: ~ ${(parsedInputs.hMm * 1.25).toFixed(2)} mm` : "..."}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion candidates switcher list */}
        {matches.length > 0 && (
          <div className={`${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-xs text-start`}>
            <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              {lang === "fa" ? "کدهای تطبیق‌یافته استاندارد AS568" : "AS568 Best Correlated Candidates"}
            </h4>
            
            <div className="space-y-2">
              {matches.map((m, idx) => {
                const isSelected = selectedMatchIdx === idx;
                return (
                  <button
                    id={`candidate-match-btn-${idx}`}
                    key={idx}
                    onClick={() => setSelectedMatchIdx(idx)}
                    className={`w-full flex justify-between items-center text-xs p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-blue-500/10 border-blue-400 shadow-3xs"
                        : `${colors.inputBg} ${colors.cardBorder} hover:bg-slate-500/5`
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                      {idx === 0 ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded-sm font-bold font-sans">
                          {lang === "fa" ? "پیشنهاد طلایی اریکس" : "Primary Pick"}
                        </span>
                      ) : (
                        <span>{lang === "fa" ? "کاندید" : "Option"} #{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[10px] text-slate-400">
                        ({m.oRing.idMm} × {m.oRing.csMm} mm)
                      </span>
                      <strong className="font-bold">
                        -{m.oRing.dash}
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Left Column: Detailed results display */}
      <div className="lg:col-span-7 space-y-6" id="gland-analysis-panel">
        {(!parsedInputs.gd || !parsedInputs.h) ? (
          <div className={`${colors.cardBg} border ${colors.cardBorder} rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px] shadow-xs`} id="empty-state">
            <Sliders className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
            <strong className="block text-base mb-1">{lang === "fa" ? "منتظر ورود ابعاد شیار" : "Awaiting Chamber Specifications"}</strong>
            <p className="text-xs text-slate-405 leading-normal max-w-xs">
              {lang === "fa" 
                ? "جهت یافتن ایده آل ترین اورینگ های وایتون و ان بی آر برای هوزینگ شما، لطفا مقادیر قطر وعمق شیار را در سمت راست تکمیل نمایید." 
                : "Input the measured diameter and deep groove clearances. Ericsson seals solver engine will evaluate physical strain levels to isolate matching parts."}
            </p>
          </div>
        ) : (
          activeMatch && (
            <div className="space-y-6 animate-none">
              {/* Core Match Card */}
              <div className={`${colors.cardBg} p-6 rounded-2xl border ${colors.cardBorder} shadow-xs text-start space-y-6`} id="gland-recommendation-board">
                
                {/* Visual Header */}
                <div className={`flex justify-between items-center border-b ${colors.cardBorder} pb-4`}>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                    {lang === "fa" ? "سایز پیشنهادی منطبق" : "Optimized Standard Sizing"}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{lang === "fa" ? "تحلیل فنی و بازرسی انطباق هوزینگ" : "Cavity Accommodation Performance"}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Target code: AS568-{activeMatch.oRing.dash} on Custom Gland
                    </p>
                  </div>
                </div>

                {/* Grid metrics details of suggested O-ring */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "کد دش نامبر (Dash)" : "AS568 Dash"}</span>
                    <strong className="text-base text-blue-600 font-mono font-black block">-{activeMatch.oRing.dash}</strong>
                  </div>
                  
                  <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "قطر داخلی واشر" : "O-Ring ID"}</span>
                    <strong className="text-xs font-mono block">{activeMatch.oRing.idMm} mm</strong>
                  </div>

                  <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "ضخامت مقطع (CS)" : "O-Ring CS"}</span>
                    <strong className="text-xs font-mono block">{activeMatch.oRing.csMm} mm</strong>
                  </div>

                  <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "سری مربوطه" : "Series Family"}</span>
                    <strong className="text-xs block font-mono">#{activeMatch.oRing.series}</strong>
                  </div>
                </div>

                {/* Assembly Compression & Stretch ratio Analysis */}
                <div className={`border-t ${colors.cardBorder} pt-5 space-y-4`}>
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    {lang === "fa" ? "تحلیل حالت فیزیکی پس از جاگذاری در شیار" : "Interference & Volumetric Compression Assessment"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* 1. Squeeze Analysis */}
                    <div className={`${colors.inputBg} p-4 rounded-xl border ${colors.cardBorder} space-y-2`}>
                      <div className="flex justify-between items-center">
                        {(() => {
                          const rating = getRatingBadge(activeMatch.squeezeRatio, "squeeze");
                          return (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${rating.color}`}>
                              {rating.label}
                            </span>
                          );
                        })()}
                        <strong className="text-slate-700 dark:text-slate-300">{lang === "fa" ? "درصد فشرده‌سازی مقطع (Squeeze)" : "Compression Strain (Squeeze %)"}</strong>
                      </div>
                      <div className="text-base font-mono font-bold text-slate-800 dark:text-slate-100">
                        {activeMatch.squeezeRatio}%
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {lang === "fa" 
                          ? `برآورد تفاضلی عمق شیار (${parsedInputs.hMm.toFixed(2)}mm) با ارتفاع لاستیک (${activeMatch.oRing.csMm}mm). نرخ بهینه برای هوزینگ های استاتیک ۱۵٪ الی ۳۰٪ است.`
                          : `Calculated gap ratio from groove cut depth (${parsedInputs.hMm.toFixed(2)} mm) relative to standard rubber thickness (${activeMatch.oRing.csMm} mm).`}
                      </p>
                    </div>

                    {/* 2. Stretch Analysis */}
                    <div className={`${colors.inputBg} p-4 rounded-xl border ${colors.cardBorder} space-y-2`}>
                      <div className="flex justify-between items-center">
                        {(() => {
                          const rating = getRatingBadge(activeMatch.stretchRatio, "stretch");
                          return (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${rating.color}`}>
                              {rating.label}
                            </span>
                          );
                        })()}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {glandType === "piston" 
                            ? (lang === "fa" ? "کشش روی بدنه شفت (Stretch)" : "Assembly ID Stretch %") 
                            : (lang === "fa" ? "درصد لقی/کشش بیرونی" : "Lube Interference %")}
                        </strong>
                      </div>
                      <div className="text-base font-mono font-bold text-slate-800 dark:text-slate-100">
                        {activeMatch.stretchRatio}%
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {glandType === "piston" 
                          ? (lang === "fa" 
                              ? `کشش کششی تناسب واشر (${activeMatch.oRing.idMm}mm) در زمان قرارگیری روی بدنه شفت با قطر (${parsedInputs.gdMm.toFixed(2)}mm). حد ایمن کشیدگی ۱٪ الی ۵٪ است.`
                              : `Inside diameter stretch ratio of the selected rubber (${activeMatch.oRing.idMm} mm) wrapping over the groove steel base (${parsedInputs.gdMm.toFixed(2)} mm). Target standard is 1% to 5%.`)
                          : (lang === "fa" 
                              ? `برآورد لقی جانبی با راد متحرک جهت فشرده‌سازی یکسان دور رینگ.`
                              : `Accommodation clearance ratio calculated for correct internal rod-clipping properties free of twisting stress.`)
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Groove Width Audit Recommendation */}
                {parsedInputs.bMm > 0 && (
                  <div className={`border-t ${colors.cardBorder} pt-5 space-y-3`} id="groove-width-audit">
                    <h4 className="text-xs font-bold flex items-center gap-1.5">
                      <Hammer className="w-4 h-4 text-blue-600" />
                      {lang === "fa" ? "ارزیابی پهنای مجاز کل شیار (Groove Width Audit)" : "Tashkari Groove Width Fit Audit"}
                    </h4>
                    {(() => {
                      const stdWidthStr = motionType === "static" 
                        ? activeMatch.closestRec.staticPistonWidth 
                        : activeMatch.closestRec.dynamicPistonWidth;
                      
                      const minStdW = parseFloat(stdWidthStr.split(" to ")[0]);
                      const maxStdW = parseFloat(stdWidthStr.split(" to ")[1]);
                      const inputW = parsedInputs.bMm;

                      const isMatched = inputW >= (minStdW - 0.2) && inputW <= (maxStdW + 0.4);

                      return (
                        <div className={`p-4 rounded-xl border text-xs flex flex-row gap-3 items-start justify-between ${
                          isMatched 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300" 
                            : "bg-amber-500/10 border-amber-550/25 text-amber-900 dark:text-amber-300"
                        }`}>
                          {isMatched ? (
                            <div className="flex gap-2 items-start text-start">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                              <div>
                                <strong className="block mb-0.5 font-bold">{lang === "fa" ? "پهنای شیار در بازه بهینه استاندارد است" : "Groove Width is within Sealing Thresholds"}</strong>
                                <p className="text-[11px] leading-normal opacity-90">
                                  {lang === "fa" 
                                    ? `پنهای شیار ورودی (${parsedInputs.b.toFixed(2)}${unit}) با استانداردهای فیزیکی واشر الاستومر مقطع ${activeMatch.oRing.csMm}mm هماهنگی کامل دارد.`
                                    : `The input width of (${parsedInputs.b.toFixed(2)} ${unit}) aligns perfectly with the volumetric expansion limit required for CS ${activeMatch.oRing.csMm} mm.`}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-start text-start">
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <strong className="block mb-0.5 text-amber-900 font-black">{lang === "fa" ? `انحراف پهنای شیار مجاز (شیار بسیار ${inputW < minStdW ? "تنگ" : "گشاد"} است)` : `Volumetric expansion risk: Groove too ${inputW < minStdW ? "narrow" : "wide"}`}</strong>
                                <p className="text-[11px] leading-normal opacity-90">
                                  {lang === "fa" 
                                    ? `اندازه پهنای شیار ورودی با ابعاد مقطع فیزیکی واشر انتخابی هماهنگ نیست. استاندارد تراشکاری پهنای ${minStdW} الی ${maxStdW} میلی‌متر را سفارش می‌کند.`
                                    : `Groove width (${parsedInputs.b.toFixed(2)} ${unit}) is out of alignment. Standard specifies optimal widths between ${minStdW} and ${maxStdW} mm for this wire class.`}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Expert recommendation text */}
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-xs text-start">
                  <span className="font-bold text-blue-700 block mb-1">
                    {lang === "fa" ? "توصیه مهندسی قالب‌سازی هیدرولیک اریکس:" : "Final Sealing Performance Guideline:"}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {lang === "fa" ? (
                      `قالب‌سازی استاندارد اورینگ اریکس توصیه می‌کند جهت تضمین عدم نفوذ سیالات صنعتی در فشارهای معلق، پخ ورودی شفت حتماً دارای زاویه ۲۰ درجه پرداخت‌شده باشد تا لاستیک در زمان اتصال صدمه ساختاری نبیند. در صورتی که روانی حرکت الاستومر اهمیت ویژه‌ای دارد، پردازش پرداخت صیقلی Ra 0.4 تا 0.8 روی شفت فلزی الزامی است.`
                    ) : (
                      `Verify that dynamic slider surfaces possess a fine finish of Ra 0.4 to 0.8 μm to prevent friction wear. To facilitate error-free assembly without nibbling the sealing rubber, provide a structured 15-20° lead-in chamfer layout bordering the casing edges.`
                    )}
                  </p>
                </div>

              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
