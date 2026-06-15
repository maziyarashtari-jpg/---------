import React, { useState, useMemo } from "react";
import { findClosestMatches } from "../data/as568";
import { SearchResult, ORingDimension } from "../types";
import { Sliders, CheckCircle, AlertTriangle, ArrowRightLeft, ShieldCheck, Scale, Ruler } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SizeToDash() {
  const { lang, t, colors } = useApp();
  const [unit, setUnit] = useState<"mm" | "inch">("mm");
  const [inputId, setInputId] = useState<string>("25.00");
  const [inputCs, setInputCs] = useState<string>("3.50");

  const [selectedMatch, setSelectedMatch] = useState<SearchResult | null>(null);

  // Parse input values based on active unit
  const targetMetrics = useMemo(() => {
    const parsedId = parseFloat(inputId) || 0;
    const parsedCs = parseFloat(inputCs) || 0;

    let idMm = 0;
    let csMm = 0;
    let idIn = 0;
    let csIn = 0;

    if (unit === "mm") {
      idMm = parsedId;
      csMm = parsedCs;
      idIn = Number((parsedId / 25.4).toFixed(4));
      csIn = Number((parsedCs / 25.4).toFixed(4));
    } else {
      idIn = parsedId;
      csIn = parsedCs;
      idMm = Number((parsedId * 25.4).toFixed(2));
      csMm = Number((parsedCs * 25.4).toFixed(2));
    }

    return { idMm, csMm, idIn, csIn };
  }, [inputId, inputCs, unit]);

  // Calculate matching / closest O-rings
  const matches = useMemo(() => {
    if (targetMetrics.idMm <= 0 || targetMetrics.csMm <= 0) return [];
    return findClosestMatches(targetMetrics.idMm, targetMetrics.csMm, 5);
  }, [targetMetrics]);

  // Determine if there's an exact match (extremely small deviation, e.g. < 0.1 mm total)
  const exactMatch = useMemo(() => {
    if (matches.length === 0) return null;
    const best = matches[0];
    
    // Check if ID and CS are very close to standard tolerances
    const isIdMatch = Math.abs(best.oRing.idMm - targetMetrics.idMm) <= 0.15;
    const isCsMatch = Math.abs(best.oRing.csMm - targetMetrics.csMm) <= 0.08;
    
    return isIdMatch && isCsMatch ? best : null;
  }, [matches, targetMetrics]);

  // Use the first match as default selection if none selected, or update selection when matches change
  const activeDetail = useMemo(() => {
    if (selectedMatch && matches.some((m) => m.oRing.dash === selectedMatch.oRing.dash)) {
      // Find the updated match in the current search array
      return matches.find((m) => m.oRing.dash === selectedMatch.oRing.dash) || matches[0];
    }
    return matches[0] || null;
  }, [matches, selectedMatch]);

  const toggleUnit = () => {
    if (unit === "mm") {
      // mm to inch
      setInputId((parseFloat(inputId) ? (parseFloat(inputId) / 25.4).toFixed(3) : "1.000"));
      setInputCs((parseFloat(inputCs) ? (parseFloat(inputCs) / 25.4).toFixed(3) : "0.139"));
      setUnit("inch");
    } else {
      // inch to mm
      setInputId((parseFloat(inputId) ? (parseFloat(inputId) * 25.4).toFixed(2) : "25.40"));
      setInputCs((parseFloat(inputCs) ? (parseFloat(inputCs) * 25.4).toFixed(2) : "3.53"));
      setUnit("mm");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="size-to-dash-module">
      {/* Right control panel: inputs */}
      <div className="lg:col-span-5 space-y-6" id="inputs-panel">
        <div className={`${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-xs text-start`}>
          <div className="flex justify-between items-center mb-6">
            <button
              id="unit-toggle-btn"
              onClick={toggleUnit}
              className={`flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] px-2.5 py-1.5 rounded-lg transition-all `}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {t("unitToggleTo")} {unit === "mm" ? t("inch") : t("mm")}
            </button>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Ruler className="w-4 h-4 text-blue-650 text-blue-600" />
              {t("inputPieceSize")}
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 mb-4 leading-normal">
            {t("requiredMeasurement")}
          </p>

          <div className="space-y-4">
            {/* Input Inner Diameter */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                {t("measuredId")} ({unit === "mm" ? t("mm") : t("inch")})
              </label>
              <div className="relative">
                <input
                  id="target-id-input"
                  type="number"
                  step="0.01"
                  className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-3 font-mono text-sm outline-none transition-all`}
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                  {unit === "mm" ? "mm" : "inch"}
                </span>
              </div>
            </div>

            {/* Input Cross Section */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                {t("measuredCs")} ({unit === "mm" ? t("mm") : t("inch")})
              </label>
              <div className="relative">
                <input
                  id="target-cs-input"
                  type="number"
                  step="0.01"
                  className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-3 font-mono text-sm outline-none transition-all`}
                  value={inputCs}
                  onChange={(e) => setInputCs(e.target.value)}
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                  {unit === "mm" ? "mm" : "inch"}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time calculated physical metadata */}
          <div className={`border-t ${colors.cardBorder} pt-4 mt-5 grid grid-cols-2 gap-4 text-xs`}>
            <div className={`${colors.inputBg} p-2.5 rounded-lg border ${colors.cardBorder}`}>
              <span className="text-slate-400 block text-[10px] mb-0.5">{lang === "fa" ? "معادل میلی‌متری مقطع" : "CS mm Equivalent"}</span>
              <strong className="font-mono text-xs">CS: {targetMetrics.csMm} mm</strong>
            </div>
            <div className={`${colors.inputBg} p-2.5 rounded-lg border ${colors.cardBorder}`}>
              <span className="text-slate-400 block text-[10px] mb-0.5">{lang === "fa" ? "معادل اینچی مقطع" : "CS inch Equivalent"}</span>
              <strong className="font-mono text-xs">CS: {targetMetrics.csIn}"</strong>
            </div>
          </div>
        </div>

        {/* Matches lists */}
        {matches.length > 0 && (
          <div className={`${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-xs text-start`}>
            <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-600" />
              {t("closestDashResults")}
            </h4>
            
            <div className="space-y-2">
              {matches.map((m, idx) => {
                const isSelected = activeDetail?.oRing.dash === m.oRing.dash;
                return (
                  <button
                    id={`match-item-${m.oRing.dash}`}
                    key={m.oRing.dash}
                    onClick={() => setSelectedMatch(m)}
                    className={`w-full flex justify-between items-center text-xs p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-blue-500/10 border-blue-400 shadow-3xs"
                        : `${colors.inputBg} ${colors.cardBorder} hover:bg-slate-500/5`
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                      {idx === 0 && exactMatch ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-sm font-bold font-sans">
                          {lang === "fa" ? "طراحی کاملاً استاندارد" : "Exact Match"}
                        </span>
                      ) : (
                        <span>{lang === "fa" ? "مجموع انحراف:" : "Dev:"} {m.deviationMm} mm</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        (ID: {m.oRing.idMm} × CS: {m.oRing.csMm})
                      </span>
                      <strong className="font-mono font-bold">
                        -{m.oRing.dash} #{idx + 1}
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Left panel: match analysis and spec sheet */}
      <div className="lg:col-span-7 space-y-6" id="match-analysis-panel border">
        
        {/* State Banner: Empty or Exact/Non-Standard */}
        {targetMetrics.idMm <= 0 || targetMetrics.csMm <= 0 ? (
          <div className={`${colors.cardBg} border ${colors.cardBorder} rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[200px] shadow-xs`} id="empty-state">
            <Sliders className="w-10 h-10 text-blue-600 mb-3 animate-pulse" />
            <strong className="block text-base mb-1">{lang === "fa" ? "ابعاد مورد را در کادر پهلو وارد کنید" : "Enter target dimensions to match"}</strong>
            <p className="text-[11px] text-slate-400 max-w-sm leading-normal">
              {t("noMatchYet")}
            </p>
          </div>
        ) : (
          <>
            {exactMatch ? (
              <div className="bg-emerald-500/10 border border-emerald-550/20 text-emerald-950 dark:text-emerald-300 rounded-2xl p-5 text-start flex items-start gap-4 shadow-3xs" id="exact-match-alert">
                <div className="bg-emerald-500 p-2 rounded-xl text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <strong className="text-sm font-bold block mb-1">{t("perfectMatch")}</strong>
                  <p className="text-xs leading-normal">
                    {lang === "fa" 
                      ? `ابعاد وارد شده با دش نامبر استاندارد AS568-${exactMatch.oRing.dash} مطابقت ۱۰۰٪ دارد. این قطعه به صورت وفور در بازار جهانی و هیدرولیک اریکس موجود است.`
                      : `The specified dimensions perfectly match standard AS568-${exactMatch.oRing.dash}. Readily available globally from stock.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-550/25 text-amber-950 dark:text-amber-300 rounded-2xl p-5 text-start flex items-start gap-4 shadow-3xs" id="non-standard-alert">
                <div className="bg-amber-500 p-2 rounded-xl text-zinc-950">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <strong className="text-sm font-bold block mb-1">{lang === "fa" ? "ابعاد غیراستاندارد است!" : "Non-Standard size dimensions"}</strong>
                  <p className="text-xs leading-normal">
                    {lang === "fa" 
                      ? "ابعاد قطعه ارسالی با هیچ کدام از کدهای دش‌ اریکس مطابقت صد درصدی ندارد. ترازآزمون‌های همسان در پایین ارائه شده است."
                      : "The input values represent a bespoke size. Standard replacements with minimal tolerance play are suggested below:"}
                  </p>
                </div>
              </div>
            )}

            {/* Micro Details on selected matched O-Ring */}
            {activeDetail && (
              <div className={`${colors.cardBg} p-6 rounded-2xl border ${colors.cardBorder} shadow-xs text-start space-y-6`} id="match-spec-sheet">
                
                {/* Visual Header */}
                <div className={`flex justify-between items-center border-b ${colors.cardBorder} pb-4`}>
                  <div className={`bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] px-2.5 py-1 rounded-lg font-mono`}>
                    {lang === "fa" ? `انحراف انطباق: ${activeDetail.deviationMm} میلی‌متر` : `Combined Deviation: ${activeDetail.deviationMm} mm`}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{lang === "fa" ? "مشخصات فنی اورینگ کاندید شده" : "Standard Candidate Specifications"}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">AS568-{activeDetail.oRing.dash} Credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`${colors.inputBg} p-3.5 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "دش نامبر اورینگ" : "Dash Number"}</span>
                    <strong className="text-base text-blue-600 font-mono font-black block">-{activeDetail.oRing.dash}</strong>
                  </div>
                  
                  <div className={`${colors.inputBg} p-3.5 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "قطر داخلی استاندارد" : "Standard ID"}</span>
                    <strong className="text-sm font-mono block">{activeDetail.oRing.idMm} mm</strong>
                  </div>

                  <div className={`${colors.inputBg} p-3.5 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "ضخامت استاندارد" : "Standard CS"}</span>
                    <strong className="text-sm font-mono block">{activeDetail.oRing.csMm} mm</strong>
                  </div>

                  <div className={`${colors.inputBg} p-3.5 rounded-xl border ${colors.cardBorder}`}>
                    <span className="text-[10px] text-slate-400 block mb-0.5">{lang === "fa" ? "کد کلی سری مربوطه" : "Wire Class Series"}</span>
                    <strong className="text-sm block">{lang === "fa" ? `سری ${activeDetail.oRing.series}` : `${activeDetail.oRing.series} Series`}</strong>
                  </div>
                </div>

                {/* Squeeze & Stretch Ratio calculations for dynamic check */}
                <div className={`border-t ${colors.cardBorder} pt-5 space-y-4`}>
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {lang === "fa" ? "تحلیل انطباق کشش و فشردگی در هوزینگ" : "Installation Stress & Deformation Risk analysis"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-none">
                    
                    {/* Stretch Analysis */}
                    <div className={`${colors.inputBg} p-4 rounded-xl border ${colors.cardBorder} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          activeDetail.stretchRatio! > 5 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {activeDetail.stretchRatio! > 5 
                            ? (lang === "fa" ? "کشش فراتر از حد مجاز" : "Excessive stretch fatigue") 
                            : (lang === "fa" ? "کشش مناسب و ایمن" : "Safe stretch margin")}
                        </span>
                        <strong className="text-slate-700 dark:text-slate-300">{lang === "fa" ? "اندازه کشش نصب (ID Stretch)" : "Installation ID Stretch"}</strong>
                      </div>
                      <div className="text-base font-mono font-bold">
                        {activeDetail.stretchRatio}%{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({activeDetail.oRing.idMm}mm vs {targetMetrics.idMm}mm)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {lang === "fa" 
                          ? "در صورت کشیدگی بیش از ۵٪، به علت تحت تنش دائم ماندن الاستومر، طول عمر اورینگ به شدت کاهش یافته یا دچار گسیختگی زودهنگام می‌گردد." 
                          : "Continuous elongation fatigue beyond 5% reduces operational life and initiates thermo-chemical stress fracturing."}
                      </p>
                    </div>

                    {/* Squeeze / Thickness Analysis */}
                    <div className={`${colors.inputBg} p-4 rounded-xl border ${colors.cardBorder} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          Math.abs(activeDetail.idSqueezeRatio!) > 15 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {Math.abs(activeDetail.idSqueezeRatio!) > 15 
                            ? (lang === "fa" ? "انحراف بالا" : "High CS Deviation") 
                            : (lang === "fa" ? "تطابق الاستیک مناسب" : "Optimal CS sizing")}
                        </span>
                        <strong className="text-slate-700 dark:text-slate-300">{lang === "fa" ? "تغییر و انحراف مقطع (CS Squeeze)" : "Cross Section (CS) Variance"}</strong>
                      </div>
                      <div className="text-base font-mono font-bold">
                        {activeDetail.idSqueezeRatio}%{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({activeDetail.oRing.csMm}mm vs {targetMetrics.csMm}mm)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {lang === "fa" 
                          ? "تفاوت ضخامت واقعی اورینگ استاندارد با قطر شیار. انحراف مقطعی بیش از ۱۵ درصد ممکن است هوزینگ آب‌بندی را از انطباق خارج سازد." 
                          : "Difference in standard caliper vs target. Variances higher than 15% undermine standard static compression design limits."}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Industrial Recommendation */}
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-xs text-start">
                  <span className="font-bold text-blue-700 block mb-1">
                    {lang === "fa" ? "توصیه مهندسی و پیشنهاد کارگاهی:" : "Engineering Workshop Recommendation:"}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {lang === "fa" ? (
                      <>
                        اگر انحراف ابعادی اورینگ انتخابی {activeDetail.deviationMm} میلی‌متر است، در هوزینگ‌های صنعتی ثابت (استاتیک)، انطباق کشسانی کاملاً کارساز بوده و مشکلی برای آب‌بندی پیش نخواهد آمد. در موقعیت کاربری متحرک دورانی یا رفت برگشتی، توصیه اکید می‌شود شفت را در تراشکاری مجدداً پله سنگ‌زنی نموده تا ابعاد شیار با دش نامبر استاندارد{" "}
                        <strong className="font-mono text-blue-600 font-bold">-{activeDetail.oRing.dash}</strong> هماهنگ شود.
                      </>
                    ) : (
                      <>
                        Since the dimensional gap is {activeDetail.deviationMm} mm, in stationary/static joints, the elastomer's self-healing memory works successfully. However, for sliding or rotary shaft seals, we recommend re-machining or grinding the groove slightly to correspond with standard size code{" "}
                        <strong className="font-mono text-blue-450 font-bold">-{activeDetail.oRing.dash}</strong> to avoid micro-leaks.
                      </>
                    )}
                  </p>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
