import React, { useState, useMemo } from "react";
import { GLAND_DESIGN_RECOMMENDATIONS } from "../data/as568";
import { GlandDesignProps } from "../types";
import { Database, Info, FileText, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function GlandDesign() {
  const { lang, t, colors } = useApp();
  const recommendations = useMemo(() => GLAND_DESIGN_RECOMMENDATIONS, []);
  const [selectedRec, setSelectedRec] = useState<GlandDesignProps>(recommendations[1]); // Default to series 100/2.62mm

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gland-design-module">
      {/* Right Column: Schema Selection & Visual Schematic */}
      <div className={`lg:col-span-5 ${colors.cardBg} p-5 rounded-2xl border ${colors.cardBorder} shadow-xs flex flex-col justify-between`} id="gland-selectors">
        <div className="text-start">
          <h3 className="text-base font-bold mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-605 text-blue-600" />
            {t("glandHeader")}
          </h3>
          <p className="text-[11px] text-slate-400 mb-5 leading-relaxed">
            {t("glandExplain")}
          </p>

          <div className="space-y-2 mb-6">
            <span className="block text-[11px] font-semibold text-slate-400 mb-2">
              {t("selectNominalCs")}
            </span>
            {recommendations.map((r) => (
              <button
                id={`gland-btn-${r.series}`}
                key={r.series}
                onClick={() => setSelectedRec(r)}
                className={`w-full flex justify-between items-center text-xs p-2.5 rounded-xl border transition-all ${
                  selectedRec.series === r.series
                    ? colors.btnPrimary
                    : `${colors.inputBg} ${colors.cardBorder} hover:bg-slate-500/5`
                }`}
              >
                <span className="font-mono text-[10px] text-slate-400">
                  {r.csMm} mm
                </span>
                <span className="font-mono">
                  {lang === "fa" ? `سری ${r.series.split("/")[0]}` : `Series ${r.series.split("/")[0]}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Groove SVG illustration */}
        <div className={`${colors.inputBg} p-4 rounded-xl border ${colors.cardBorder} flex flex-col items-center`}>
          <span className="text-[9px] bg-white dark:bg-slate-900 border ${colors.cardBorder} text-slate-400 rounded px-2 py-0.5 mb-2 font-medium">
            {t("schematicTitle")}
          </span>
          <svg width="220" height="110" viewBox="0 0 220 110" className="opacity-90">
            {/* Shaft/Piston body */}
            <path d="M 10,10 L 80,10 L 80,80 L 140,80 L 140,10 L 210,10" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <path d="M 10,100 L 210,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* O-ring inside the groove */}
            <circle cx="110" cy="50" r="22" fill="#1e293b" className="opacity-95" />
            
            {/* Dimensions labels */}
            {/* Depth label 'h' */}
            <line x1="88" y1="10" x2="88" y2="80" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 88,10 L 88,80" stroke="#2563eb" strokeWidth="1" />
            <text x="74" y="48" fill="#1d4ed8" className="text-[10px] font-mono select-none font-bold">h</text>
            
            {/* Width label 'b' */}
            <path d="M 80,92 L 140,92" stroke="#10b981" strokeWidth="1" />
            <text x="106" y="103" fill="#047857" className="text-[10px] font-mono select-none font-bold">b</text>

            {/* O-Ring CS label 'd' */}
            <line x1="110" y1="28" x2="110" y2="72" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="114" y="54" fill="#64748b" className="text-[9px] font-mono select-none font-bold">CS</text>
          </svg>
          <div className="flex gap-4 mt-2 text-[9px] text-slate-400">
            <span>{t("depthSymbol")}</span>
            <span>{t("widthSymbol")}</span>
          </div>
        </div>
      </div>

      {/* Left Column: Dimensions details */}
      <div className={`lg:col-span-7 ${colors.cardBg} p-6 rounded-2xl border ${colors.cardBorder} shadow-xs text-start space-y-6`} id="gland-details">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2">
            <h2 className="text-lg font-bold">{t("tableTitle")}</h2>
            <span className={`text-[10px] ${colors.badgeBg} ${colors.badgeText} border rounded-full px-3 py-1 font-mono`}>
              ORing Series: {selectedRec.series.split("/")[0]}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t("tableSubtitle")} {selectedRec.csMm} mm
          </p>
        </div>

        {/* Static vs Dynamic Sealing tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Static sealing */}
          <div className="bg-blue-500/5 rounded-xl border border-blue-500/10 p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-blue-500/10">
              <span className="bg-blue-600 text-white rounded text-[8px] px-1.5 py-0.5 font-bold">
                {t("staticSealDesc")}
              </span>
              <h4 className="font-bold text-sm">{t("staticSeal")}</h4>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("grooveDepthH")}</span>
                <span className="font-mono font-bold">{selectedRec.staticPistonDepth} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("grooveWidthB")}</span>
                <span className="font-mono font-bold">{selectedRec.staticPistonWidth} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-505 font-bold">{t("squeezePercent")}</span>
                <span className="font-mono text-blue-600 font-black">{selectedRec.squeezeStaticRange}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-404 text-slate-400 leading-normal pt-2 border-t border-blue-550/10">
              {t("staticExtraExplain")}
            </p>
          </div>

          {/* Dynamic sealing */}
          <div className="bg-indigo-550/5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
              <span className="bg-indigo-505 bg-indigo-500 text-white rounded text-[8px] px-1.5 py-0.5 font-bold">
                {t("dynamicSealDesc")}
              </span>
              <h4 className="font-bold text-sm">{t("dynamicSeal")}</h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("grooveDepthH")}</span>
                <span className="font-mono font-bold">{selectedRec.dynamicPistonDepth} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("grooveWidthB")}</span>
                <span className="font-mono font-bold">{selectedRec.dynamicPistonWidth} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-505 font-bold">{t("squeezePercent")}</span>
                <span className="font-mono text-indigo-500 font-black">10% to 15%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-404 text-slate-400 leading-normal pt-2 border-t border-indigo-500/10">
              {t("dynamicExtraExplain")}
            </p>
          </div>

        </div>

        {/* Technical tolerance parameters */}
        <div className={`${colors.inputBg} rounded-xl border ${colors.cardBorder} p-4 space-y-3`} id="gland-tolerances">
          <h4 className="text-xs font-bold flex items-center gap-1.5 justify-start">
            <Info className="w-3.5 h-3.5 text-blue-650" />
            {lang === "fa" ? "پارامترهای فنی شفت و لقی مجاز شعاعی" : "Clearance Gap & Shaft Tolerances"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between p-1 hover:bg-slate-500/5 rounded transition-all">
              <span className="text-slate-400">{lang === "fa" ? "حداکثر لقی مجاز شعاعی (g):" : "Max Radial Clearance (g):"}</span>
              <span className="font-mono">{selectedRec.radialClearance} mm</span>
            </div>
            <div className="flex justify-between p-1 hover:bg-slate-500/5 rounded transition-all">
              <span className="text-slate-400">{lang === "fa" ? "پخ نهایی و انحنای کف شیار:" : "Corner Radius (R):"}</span>
              <span className="font-mono">R: 0.1 to 0.2 mm</span>
            </div>
            <div className="flex justify-between p-1 hover:bg-slate-500/5 rounded transition-all">
              <span className="text-slate-400">{lang === "fa" ? "صافی سطح هوزینگ (فولادی):" : "Sealing surface roughness:"}</span>
              <span className="font-mono">Ra 0.8 / 1.6 μm</span>
            </div>
            <div className="flex justify-between p-1 hover:bg-slate-500/5 rounded transition-all">
              <span className="text-slate-400">{lang === "fa" ? "حداکثر صافی سطح جدار بیرونی متحرک:" : "Dynamic surface finish:"}</span>
              <span className="font-mono">Ra 0.4 μm</span>
            </div>
          </div>
        </div>

        {/* Safety advice */}
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-950 dark:text-rose-305 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1 justify-start">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            {lang === "fa" ? "هشدار جلوگیری از بیرون‌زدگی اورینگ (Extrusion Risk)" : "Extrusion Gap Mechanical Caution"}
          </div>
          <p className="leading-normal text-slate-600 dark:text-slate-350 text-[11px]">
            {lang === "fa" ? (
              "در فشارهای کاری بالای ۱۰۰ بار (10 MPa)، همواره ریسک رانده‌شدن و زبانه کشیدن لاستیک اورینگ به داخل هدایتگر پیستون وجود دارد. در این موارد، حتماً از بک‌آپ رینگ تفلونی (Backup Ring (PTFE)) در کنار اورینگ اریکس استفاده کنید."
            ) : (
              "For hydro-system pressures exceeding 100 bar (10 MPa), the elastomer faces extrusion flow hazards into the slider clearance. Designing back-up rings made of solid PTFE or virgin Nylon is highly advised to retain continuous O-ring geometry."
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
