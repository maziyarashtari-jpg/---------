import React, { useState, useMemo } from "react";
import { getAS568Dimensions } from "../data/as568";
import { ORingDimension } from "../types";
import { Search, Info, HelpCircle, Layers, ZoomIn } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function DashToSize() {
  const { lang, t, colors, theme } = useApp();
  const allOrings = useMemo(() => getAS568Dimensions(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("All");
  const [selectedOring, setSelectedOring] = useState<ORingDimension>(allOrings[9]); // default to 010

  // Filter o-rings based on search query and selected series tab
  const filteredOrings = useMemo(() => {
    return allOrings.filter((o) => {
      const matchesSearch = o.dash.includes(searchQuery) || o.series.includes(searchQuery);
      const matchesSeries = selectedSeries === "All" || o.series === selectedSeries;
      return matchesSearch && matchesSeries;
    });
  }, [allOrings, searchQuery, selectedSeries]);

  const seriesTabs = [
    { key: "All", label: lang === "fa" ? "همه سری‌ها" : "All Series" },
    { key: "000", label: lang === "fa" ? "سری 000 (توضیح ۱.۷۸ میلی‌متر)" : "000 Series (1.78 mm CS)" },
    { key: "100", label: lang === "fa" ? "سری 100 (توضیح ۲.۶۲ میلی‌متر)" : "100 Series (2.62 mm CS)" },
    { key: "200", label: lang === "fa" ? "سری 200 (توضیح ۳.۵۳ میلی‌متر)" : "200 Series (3.53 mm CS)" },
    { key: "300", label: lang === "fa" ? "سری 300 (توضیح ۵.۳۳ میلی‌متر)" : "300 Series (5.33 mm CS)" },
    { key: "400", label: lang === "fa" ? "سری 400 (توضیح ۶.۹۹ میلی‌متر)" : "400 Series (6.99 mm CS)" },
    { key: "900", label: lang === "fa" ? "سری 900 (مخصوص اتصالات رزوه)" : "900 Series (Boss Glands)" }
  ];

  // Approximate proportions for SVG o-ring visualization
  const visMetrics = useMemo(() => {
    if (!selectedOring) return { diameter: 100, stroke: 10 };
    const id = selectedOring.idMm;
    const cs = selectedOring.csMm;
    const totalOut = id + (2 * cs);
    
    // Scale so it fits in a 240px SVG container beautifully
    const scale = Math.min(130 / totalOut, 20); 
    const r_inner = (id * scale) / 2;
    const r_outer = r_inner + (cs * scale);
    const strokeWidth = cs * scale;
    const centerRadius = r_inner + (strokeWidth / 2);

    return {
      idMm: id,
      csMm: cs,
      centerRadius,
      strokeWidth,
      outerDiameter: totalOut.toFixed(2),
      innerRadius: r_inner,
      outerRadius: r_outer
    };
  }, [selectedOring]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dash-to-size-module">
      {/* Right Column: List & Filter (Adaptive Layout) */}
      <div className={`lg:col-span-4 ${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} flex flex-col h-[650px] shadow-xs`} id="list-column">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <Layers className={`w-4 h-4 ${colors.accentText}`} />
          {lang === "fa" ? "جستجو و انتخاب دش نامبر" : "Find O-Ring by Dash No."}
        </h3>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            id="dash-search-input"
            type="text"
            className={`w-full text-start ${colors.inputBg} border ${colors.cardBorder} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2 px-9 text-xs outline-none transition-all placeholder:text-slate-400`}
            placeholder={t("searchDashPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Series filter badges */}
        <div className="flex flex-wrap gap-1.5 mb-3 max-h-[140px] overflow-y-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {seriesTabs.map((tItem) => (
            <button
              id={`tab-series-${tItem.key}`}
              key={tItem.key}
              onClick={() => setSelectedSeries(tItem.key)}
              className={`text-[10px] font-medium px-2 py-1 rounded-lg border transition-all ${
                selectedSeries === tItem.key
                  ? colors.btnPrimary
                  : `${colors.inputBg} ${colors.cardBorder} hover:bg-slate-100`
              }`}
            >
              {tItem.label.split(" (")[0]}
            </button>
          ))}
        </div>

        {/* Search results list */}
        <div className={`overflow-y-auto flex-1 border ${colors.cardBorder} rounded-xl divide-y ${colors.cardBorder} text-xs`} id="search-results-viewport">
          {filteredOrings.length > 0 ? (
            filteredOrings.map((o) => (
              <button
                id={`oring-row-${o.dash}`}
                key={o.dash}
                onClick={() => setSelectedOring(o)}
                className={`w-full flex justify-between items-center px-3 py-2.5 text-start transition-all ${
                  selectedOring.dash === o.dash
                    ? "bg-blue-500/10 border-l-4 border-blue-600 font-semibold"
                    : "hover:bg-slate-500/5"
                }`}
              >
                <span className="font-mono text-[10px] text-slate-400">
                  ID: {o.idMm} × CS: {o.csMm} mm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${colors.badgeBg} ${colors.badgeText} border`}>
                    {lang === "fa" ? "سری" : "Ser"} {o.series}
                  </span>
                  <strong className="font-mono text-xs">-{o.dash}</strong>
                </span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              {lang === "fa" ? "هیچ اورینگی یافت نشد. طرح جستجو را تغییر دهید." : "No O-ring found. Try a different search query."}
            </div>
          )}
        </div>
        
        <div className="text-[10px] text-slate-400 mt-2 text-start font-mono">
          {lang === "fa" 
            ? `تعداد نتایج یافت شده: ${filteredOrings.length} سایز استاندارد` 
            : `Found: ${filteredOrings.length} standard sizes`}
        </div>
      </div>

      {/* Left Column: Visual Display & Specifications */}
      <div className="lg:col-span-8 space-y-6" id="specs-column">
        {/* Main Specs Card */}
        <div className={`${colors.cardBg} p-6 rounded-2xl shadow-xs border ${colors.cardBorder}`} id="specs-main-card">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b ${colors.cardBorder} pb-4 mb-6`}>
            <span className={`text-[10px] font-mono ${colors.badgeBg} ${colors.badgeText} border px-3 py-1 rounded-full`}>
              AS568 Standard Code
            </span>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <div className="text-start">
                <h2 className={`text-2xl font-black ${colors.accentText} font-mono`}>
                  AS568-{selectedOring.dash}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {lang === "fa" ? "مشخصات فنی و انطباقی اورینگ" : "O-Ring engineering credentials"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-base font-bold">
                #{selectedOring.dash}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Visualizer (proportionally scaled) */}
            <div className={`md:col-span-5 flex flex-col items-center justify-center ${colors.inputBg} rounded-2xl p-4 border ${colors.cardBorder} h-[280px]`}>
              <span className={`text-[9px] bg-white border ${colors.cardBorder} dark:bg-slate-900 shadow-3xs px-2 py-0.5 rounded-full text-slate-400 mb-2 font-medium flex items-center gap-1`}>
                <ZoomIn className="w-3 h-3 text-blue-650" />
                {lang === "fa" ? "ترسیم هندسی ۲D اورینگ" : "2D CAD Visualizer"}
              </span>
              
              <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-xs">
                  <circle cx="90" cy="90" r="85" className="fill-none stroke-slate-200/50 stroke-1" />
                  <circle cx="90" cy="90" r="10" className="fill-none stroke-slate-200/50 stroke-1" />
                  {/* The O-Ring Core */}
                  <circle
                    cx="90"
                    cy="90"
                    r={Math.max(12, visMetrics.centerRadius)}
                    fill="none"
                    stroke={theme === "slate-blue" ? "#1e293b" : theme === "dark-steel" ? "#06b6d4" : theme === "industrial-amber" ? "#f59e0b" : "#84cc16"}
                    strokeWidth={Math.max(4, visMetrics.strokeWidth)}
                    className="transition-all duration-300"
                  />
                  {/* Dimension overlay lines */}
                  {/* ID Line */}
                  <line 
                    x1={90 - visMetrics.innerRadius} 
                    y1="90" 
                    x2={90 + visMetrics.innerRadius} 
                    y2="90" 
                    stroke="#2563eb" 
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* CS Circle indicator */}
                  <circle 
                    cx={90 + visMetrics.centerRadius} 
                    cy="90" 
                    r={visMetrics.strokeWidth / 2} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="0.8"
                  />
                </svg>

                {/* Diameter markings */}
                <span className={`absolute bottom-1 bg-white dark:bg-slate-900 border ${colors.cardBorder} px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono`}>
                  OD: {visMetrics.outerDiameter} mm
                </span>
              </div>
              
              <div className="flex gap-4 mt-2 text-[9px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  {t("innerDiameter")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-550 bg-emerald-500 rounded-full"></span>
                  {t("crossSection")}
                </span>
              </div>
            </div>

            {/* Dimensional and Tolerance Data */}
            <div className="md:col-span-7 space-y-3">
              <div className="grid grid-cols-2 gap-3" id="specs-grid">
                
                {/* ID Metric */}
                <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder} text-start`}>
                  <span className="text-[10px] text-slate-400 block font-medium">{t("idStandardField")} - mm</span>
                  <div className="text-lg font-mono font-black mt-1">
                    {selectedOring.idMm}{" "}
                    <span className="text-[10px] font-normal text-slate-400">mm</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                    {t("tolerance")}: ±{selectedOring.idTolMm} mm
                  </div>
                </div>

                {/* CS Metric */}
                <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder} text-start`}>
                  <span className="text-[10px] text-slate-400 block font-medium">{t("csStandardField")} - mm</span>
                  <div className="text-lg font-mono font-black mt-1">
                    {selectedOring.csMm}{" "}
                    <span className="text-[10px] font-normal text-slate-400">mm</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-mono mt-0.5">
                    {t("tolerance")}: ±{selectedOring.csTolMm} mm
                  </div>
                </div>

                {/* ID Imperial */}
                <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder} text-start`}>
                  <span className="text-[10px] text-slate-400 block font-medium">{t("innerDiameter")} - inch</span>
                  <div className="text-lg font-mono font-black mt-1">
                    {selectedOring.idIn}"{" "}
                    <span className="text-[10px] font-normal text-slate-400">inch</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {t("tolerance")}: ±{selectedOring.idTolIn}"
                  </div>
                </div>

                {/* CS Imperial */}
                <div className={`${colors.inputBg} p-3 rounded-xl border ${colors.cardBorder} text-start`}>
                  <span className="text-[10px] text-slate-400 block font-medium">{t("crossSection")} - inch</span>
                  <div className="text-lg font-mono font-black mt-1">
                    {selectedOring.csIn}"{" "}
                    <span className="text-[10px] font-normal text-slate-400">inch</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {t("tolerance")}: ±{selectedOring.csTolIn}"
                  </div>
                </div>

              </div>

              {/* Summary specifications */}
              <div className="bg-blue-500/5 p-3.5 rounded-xl border border-blue-500/10 text-start text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  {lang === "fa" ? "سیستم اندازه فرکشنال (نامی)" : "Fractional Nominal Class System"}
                </div>
                <p className="text-slate-500 dark:text-slate-300 leading-normal text-[11px]">
                  {lang === "fa" ? (
                    <>
                      این اورینگ در دسته ابعاد نامی{" "}
                      <strong className="text-blue-500 font-mono">
                        {selectedOring.csIn === 0.070 ? '1/16' : 
                         selectedOring.csIn === 0.103 ? '3/32' : 
                         selectedOring.csIn === 0.139 ? '1/8' : 
                         selectedOring.csIn === 0.210 ? '3/16' : 
                         selectedOring.csIn === 0.275 ? '1/4' : 'سایر'} اینچ
                      </strong>{" "}
                      ضخامت و قطر داخلی حدودی{" "}
                      <strong className="text-blue-500 font-mono">
                        {selectedOring.nominalIdIn ? selectedOring.nominalIdIn : `${Math.round(selectedOring.idIn * 16) / 16}`}
                      </strong>{" "}
                      اینچ قرار دارد.
                    </>
                  ) : (
                    <>
                      This O-ring belongs to nominal{" "}
                      <strong className="text-blue-400 font-mono">
                        {selectedOring.csIn === 0.070 ? '1/16' : 
                         selectedOring.csIn === 0.103 ? '3/32' : 
                         selectedOring.csIn === 0.139 ? '1/8' : 
                         selectedOring.csIn === 0.210 ? '3/16' : 
                         selectedOring.csIn === 0.275 ? '1/4' : 'Other'} inch
                      </strong>{" "}
                      wire class, approximating to standard fractional diameter{" "}
                      <strong className="text-blue-400 font-mono">
                        {selectedOring.nominalIdIn ? selectedOring.nominalIdIn : `${Math.round(selectedOring.idIn * 16) / 16}`}
                      </strong>{" "}
                      inch.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Guidelines for the selected O-Ring size */}
        <div className={`${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-3xs`} id="specs-secondary-card">
          <h4 className="text-xs font-bold mb-3 text-start flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            {lang === "fa" 
              ? `توصیه‌های فنی آب‌بندی با سایز ${selectedOring.dash}` 
              : `Engineering Advice for O-Ring Size -${selectedOring.dash}`}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-start text-xs">
            <div className={`${colors.inputBg} p-3 rounded-lg border ${colors.cardBorder}`}>
              <span className="text-slate-400 block text-[10px] mb-0.5">{lang === "fa" ? "کاهش ارتفاع نامی (Squeeze %)" : "Compression Squeeze %"}</span>
              <strong className="text-slate-700 dark:text-slate-200 text-xs">
                {selectedOring.series === "900" ? "۱۲٪ الی ۱۸٪ Static" : "۱۵٪ الی ۲۵٪ Static"}
              </strong>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                {lang === "fa" 
                  ? "میزان فشرده‌سازی لازم مقطع اورینگ در داخل شیار جهت آب‌بندی بهینه." 
                  : "Target compression strain required in the cavity to establish robust sealing contact."}
              </p>
            </div>
            
            <div className={`${colors.inputBg} p-3 rounded-lg border ${colors.cardBorder}`}>
              <span className="text-slate-400 block text-[10px] mb-0.5">{lang === "fa" ? "کشش نصب مجاز (Stretch %)" : "Assembly Stretch %"}</span>
              <strong className="text-slate-700 dark:text-slate-200 text-xs">
                {lang === "fa" ? "حداکثر ۱٪ الی ۵٪ روی شفت" : "Max 1% to 5% over Shaft"}
              </strong>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                {lang === "fa" 
                  ? "توصیه می‌شود مقدار کشش قطر داخلی اورینگ در هنگام نصب بر روی پیستون از ۵٪ فراتر نرود." 
                  : "Inner perimeter elongation when pulled over the shaft should avoid exceeding 5%."}
              </p>
            </div>

            <div className={`${colors.inputBg} p-3 rounded-lg border ${colors.cardBorder}`}>
              <span className="text-slate-400 block text-[10px] mb-0.5">{lang === "fa" ? "محیط پیرامونی داخلی (Perimeter)" : "Internal Perimeter Length"}</span>
              <strong className="text-slate-700 dark:text-slate-200 font-mono text-xs">
                {(Math.PI * selectedOring.idMm).toFixed(1)} mm
              </strong>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                {lang === "fa" 
                  ? "اندازه محیط داخلی اورینگ بر اساس محاسبه طول گسترده (مفید در فرآیند تولید و کنترل ابزار)." 
                  : "Internal circumference used as the core cut-length indicator for dye validation."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
