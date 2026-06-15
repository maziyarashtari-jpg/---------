import React, { useState } from "react";
import DashToSize from "./components/DashToSize";
import SizeToDash from "./components/SizeToDash";
import GlandDesign from "./components/GlandDesign";
import GlandToOring from "./components/GlandToOring";
import MaterialGuide from "./components/MaterialGuide";
import { Hammer, CircleDot, Database, HelpCircle, Activity, Sliders, Globe, Palette } from "lucide-react";
import { useApp } from "./context/AppContext";

export default function App() {
  const { lang, setLang, theme, setTheme, t, colors } = useApp();
  const [activeTab, setActiveTab] = useState<"dash-to-size" | "size-to-dash" | "gland" | "gland-to-oring" | "material">("dash-to-size");

  const dir = lang === "fa" ? "rtl" : "ltr";

  const tabs = [
    {
      id: "dash-to-size",
      label: t("tabDashToSize"),
      icon: <CircleDot className="w-4 h-4" />,
      desc: t("tabDashToSizeDesc"),
      indicator: lang === "fa" ? "کد سه رقمی" : "3-Digit Code"
    },
    {
      id: "size-to-dash",
      label: t("tabSizeToDash"),
      icon: <Database className="w-4 h-4" />,
      desc: t("tabSizeToDashDesc"),
      indicator: "ID × CS"
    },
    {
      id: "gland",
      label: t("tabGlandDesign"),
      icon: <Hammer className="w-4 h-4" />,
      desc: t("tabGlandDesignDesc"),
      indicator: lang === "fa" ? "تراشکاری" : "Glanding"
    },
    {
      id: "gland-to-oring",
      label: t("tabGlandToOring"),
      icon: <Sliders className="w-4 h-4" />,
      desc: t("tabGlandToOringDesc"),
      indicator: lang === "fa" ? "دش‌یاب" : "Finder"
    },
    {
      id: "material",
      label: t("tabMaterialGuide"),
      icon: <Activity className="w-4 h-4" />,
      desc: t("tabMaterialGuideDesc"),
      indicator: lang === "fa" ? "شیمیایی" : "Material"
    }
  ];

  return (
    <div className={`min-h-screen ${colors.mainBg} ${colors.text} font-sans antialiased selection:bg-blue-200 transition-colors duration-200`} dir={dir} id="oring-app-root">
      
      {/* Top Header Section as in Professional Polish */}
      <header className={`${colors.headerBg} text-white px-6 py-5 md:px-8 flex flex-col md:flex-row justify-between items-center border-b-4 ${colors.headerBorder} shadow-md sticky top-0 z-50`} id="app-header">
        <div className="text-start flex flex-col items-center md:items-start text-center md:text-start">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans-display">
            {t("appName")} <span className="text-blue-450 text-blue-400 font-light">| {t("subTitle")}</span>
          </h1>
          <p className="text-slate-400 text-[11px] uppercase tracking-wider mt-1 font-mono">
            {t("subTitleDesc")}
          </p>
          
          {/* Creator Credits */}
          <div className="mt-2 flex flex-col sm:flex-row items-center sm:items-start gap-x-3 gap-y-1 text-slate-400 text-[11px] border-t border-slate-700/60 pt-2 w-full justify-center md:justify-start">
            <span className="font-semibold text-blue-400">
              {lang === "fa" ? "سازنده برنامه: مازیار" : "App Creator: Maziyar"}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="font-mono text-slate-300">
              {lang === "fa" ? "ایمیل: maziyar.ashtari@gmail.com" : "Email: maziyar.ashtari@gmail.com"}
            </span>
          </div>
        </div>
        
        {/* Controls: Language Dropdown + Theme Select */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 md:mt-0">
          
          {/* Language Selector Segmented */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-705 border-slate-700 rounded-xl p-1.5" id="lang-switcher-control">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex rounded-lg overflow-hidden bg-slate-900 text-[10px] font-bold">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 cursor-pointer transition-all ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("fa")}
                className={`px-2.5 py-1 cursor-pointer transition-all font-sans ${lang === "fa" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                فارسی
              </button>
            </div>
          </div>

          {/* Theme Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl p-1.5" id="theme-switcher-control">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="bg-slate-900 border-none text-slate-200 text-[11px] rounded px-1.5 py-0.5 outline-none cursor-pointer focus:ring-0 font-sans"
            >
              <option value="slate-blue">📁 {lang === "fa" ? "طرح سازمانی اریکس" : "Slate Corporate"}</option>
              <option value="dark-steel">🔩 {lang === "fa" ? "فولاد تاریک (صنعتی)" : "Dark Steel"}</option>
              <option value="industrial-amber">⚙️ {lang === "fa" ? "کهربایی ایمنی" : "Industrial Amber"}</option>
              <option value="tech-emerald">📟 {lang === "fa" ? "ماتریس زمرد" : "Matrix Emerald"}</option>
            </select>
          </div>

          <div className="hidden lg:flex gap-4 font-mono text-start border-l border-slate-700 pl-4">
            <div>
              <p className="text-[9px] text-slate-400 uppercase">{t("currentStandard")}</p>
              <p className="text-xs font-semibold text-blue-400">AS568-B rev 2026</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase">{t("toleranceClass")}</p>
              <p className="text-xs font-semibold text-emerald-400">ISO 3601-1 Class A</p>
            </div>
          </div>
        </div>
      </header>

      {/* Database/System Stat bar */}
      <div className={`${colors.metaBg} ${colors.statText} px-6 py-2 md:px-8 text-xs flex justify-between items-center border-b border-slate-700`}>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-wider text-right">{t("databaseConnected")}</span>
        </div>
        <div className="text-slate-400 text-[10px] font-mono">{t("activeSystem")}</div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-main">
        
        {/* Dynamic Interactive Tabs with adaptive look */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8" id="tab-selectors-container">
          {tabs.map((tItem) => {
            const isActive = activeTab === tItem.id;
            return (
              <button
                id={`app-tab-${tItem.id}`}
                key={tItem.id}
                onClick={() => setActiveTab(tItem.id as any)}
                className={`text-start p-4 rounded-xl border transition-all flex flex-col justify-between h-[105px] cursor-pointer ${
                  isActive ? colors.tabActive : colors.tabInactive
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {tItem.icon}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isActive ? "bg-blue-50 text-blue-800" : "bg-slate-50 text-slate-500"}`}>
                    {tItem.indicator}
                  </span>
                </div>
                <div className="mt-2 text-start">
                  <span className={`block text-xs font-bold leading-tight ${isActive ? "text-blue-600" : "text-slate-700 dark:text-slate-300"}`}>
                    {tItem.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {tItem.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Viewport */}
        <div className="min-h-[500px]" id="tab-content-viewport">
          {activeTab === "dash-to-size" && <DashToSize />}
          {activeTab === "size-to-dash" && <SizeToDash />}
          {activeTab === "gland" && <GlandDesign />}
          {activeTab === "gland-to-oring" && <GlandToOring />}
          {activeTab === "material" && <MaterialGuide />}
        </div>

        {/* Standard-based technical documentation section */}
        <section className={`p-6 rounded-xl border ${colors.cardBg} ${colors.cardBorder} mt-12 text-start shadow-xs`} id="technical-reference-sheets">
          <div className="flex items-center gap-2 mb-4 justify-start border-b border-slate-100 dark:border-slate-800 pb-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold">
              {t("docsTitle")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-550 text-slate-500 dark:text-slate-400 leading-relaxed">
            <div className="space-y-1">
              <strong className="block mb-1.5 text-slate-800 font-bold dark:text-slate-200">{t("whatIsTitle")}</strong>
              <p>
                {t("whatIsDesc")}
              </p>
            </div>
            
            <div className="space-y-1">
              <strong className="block mb-1.5 text-slate-800 font-bold dark:text-slate-200">{t("readingTitle")}</strong>
              <p>
                {t("readingDesc")}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="block mb-1.5 text-slate-800 font-bold dark:text-slate-200">{t("safeSealTitle")}</strong>
              <p>
                {t("safeSealDesc")}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Modern, clean, un-cluttered footer matching theme */}
      <footer className="bg-slate-900 border-t border-slate-850 py-5 mt-16 text-center text-xs text-slate-400" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-slate-400 text-[10px] md:text-xs">{t("footerText")}</p>
          <div className="flex gap-4 text-[9px] md:text-[11px] font-mono text-slate-500">
            <span>VERSION 2.42-STABLE</span>
            <span>|</span>
            <span>{t("systemStatusOptimal")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
