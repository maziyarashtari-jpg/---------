import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fa" | "en";
export type Theme = "slate-blue" | "dark-steel" | "industrial-amber" | "tech-emerald";

export interface ThemeColors {
  mainBg: string;
  text: string;
  textSecondary: string;
  headerBg: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  tabActive: string;
  tabInactive: string;
  badgeBg: string;
  badgeText: string;
  btnPrimary: string;
  accentText: string;
  inputBg: string;
  borderHover: string;
  metaBg: string;
  statText: string;
}

export const themeMap: Record<Theme, ThemeColors> = {
  "slate-blue": {
    mainBg: "bg-slate-50",
    text: "text-slate-900",
    textSecondary: "text-slate-500",
    headerBg: "bg-slate-900",
    headerBorder: "border-blue-600",
    cardBg: "bg-white",
    cardBorder: "border-slate-200",
    tabActive: "bg-white border-blue-600 ring-blue-600/15 text-slate-900 shadow-sm",
    tabInactive: "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50/50",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-800",
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold",
    accentText: "text-blue-600",
    inputBg: "bg-slate-50",
    borderHover: "hover:border-slate-300",
    metaBg: "bg-slate-800",
    statText: "text-slate-300"
  },
  "dark-steel": {
    mainBg: "bg-slate-950",
    text: "text-slate-100",
    textSecondary: "text-slate-400",
    headerBg: "bg-slate-900",
    headerBorder: "border-cyan-500",
    cardBg: "bg-slate-905 bg-slate-900",
    cardBorder: "border-slate-800",
    tabActive: "bg-slate-800 border-cyan-500 ring-cyan-500/20 text-white shadow-sm",
    tabInactive: "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50",
    badgeBg: "bg-cyan-950 border-cyan-800",
    badgeText: "text-cyan-400",
    btnPrimary: "bg-cyan-550 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-sm",
    accentText: "text-cyan-400",
    inputBg: "bg-slate-900/60",
    borderHover: "hover:border-slate-700",
    metaBg: "bg-slate-900",
    statText: "text-slate-400"
  },
  "industrial-amber": {
    mainBg: "bg-zinc-150 bg-zinc-100",
    text: "text-zinc-900",
    textSecondary: "text-zinc-500",
    headerBg: "bg-zinc-900",
    headerBorder: "border-amber-500",
    cardBg: "bg-white",
    cardBorder: "border-zinc-200",
    tabActive: "bg-white border-amber-500 ring-amber-500/15 text-zinc-900 shadow-sm",
    tabInactive: "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-800",
    btnPrimary: "bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shadow-sm",
    accentText: "text-amber-600",
    inputBg: "bg-zinc-50",
    borderHover: "hover:border-zinc-300",
    metaBg: "bg-zinc-800",
    statText: "text-zinc-300"
  },
  "tech-emerald": {
    mainBg: "bg-emerald-950/95",
    text: "text-emerald-50",
    textSecondary: "text-emerald-400/80",
    headerBg: "bg-emerald-990 bg-emerald-900/60",
    headerBorder: "border-lime-500",
    cardBg: "bg-emerald-900/20",
    cardBorder: "border-emerald-800/80",
    tabActive: "bg-emerald-900 border-lime-400 ring-lime-400/20 text-lime-300 shadow-sm",
    tabInactive: "bg-emerald-950/40 border-emerald-900/60 text-emerald-400 hover:border-emerald-700 hover:bg-emerald-900/30",
    badgeBg: "bg-lime-950/50 border-lime-900",
    badgeText: "text-lime-400",
    btnPrimary: "bg-lime-500 hover:bg-lime-450 text-emerald-950 font-bold shadow-sm hover:bg-lime-400",
    accentText: "text-lime-400",
    inputBg: "bg-emerald-950/60",
    borderHover: "hover:border-emerald-700",
    metaBg: "bg-emerald-950",
    statText: "text-emerald-400"
  }
};

// Simple localized dictionary structure
export const dictionary = {
  // App Header & Footer
  appName: { fa: "مرجع تخصصی اورینگ", en: "O-Ring Master" },
  subTitle: { fa: "استاندارد هوا و فضا AS568", en: "AS568 Aerospace Standard" },
  subTitleDesc: { fa: "سیستم برخط محاسبات مهندسی انطباق تفصیلی", en: "ENGINEERING DIMENSIONING TOOL (ERIK O-RING STANDARDS)" },
  currentStandard: { fa: "استاندارد جاری", en: "Current Standard" },
  toleranceClass: { fa: "کلاس تلرانس", en: "Tolerance Class" },
  databaseConnected: { fa: "سیستم برخط اریکس | متصل", en: "DATABASE CONNECTED | ERIKS SYSTEM" },
  activeSystem: { fa: "سامانه مرجع فعال", en: "AS568_REV_2026_ACTIVE" },
  footerText: { fa: "محاسبه‌گر تخصصی انطباق اورینگ اریکس بر اساس استاندارد جهانی AS568 ویرایش ۲۰۲۶", en: "Eriks Specialized O-Ring Compatibility Calculator based on Global AS568 Edition 2026" },
  systemStatusOptimal: { fa: "وضعیت سیستم: بهینه", en: "SYSTEM STATUS: OPTIMAL" },

  // Tabs Labels
  tabDashToSize: { fa: "دش‌نامبر به ابعاد اورینگ", en: "Dash to O-Ring Dimensions" },
  tabDashToSizeDesc: { fa: "یافتن ابعاد و تلرانس هر کد استاندارد", en: "Find standard dimensions & tolerances" },
  tabSizeToDash: { fa: "ابعاد به دش‌نامبر اورینگ", en: "Dimensions to Dash Number" },
  tabSizeToDashDesc: { fa: "یافتن سایزهای هم‌پوشان و استاندارد", en: "Match metric or imperial sizes to standard" },
  tabGlandDesign: { fa: "طراحی شیار نشیمنگاه (Gland)", en: "Gland Groove Design" },
  tabGlandDesignDesc: { fa: "استاندارد تراشکاری و عمق شیار شفت", en: "Machining guides & groove depth" },
  tabGlandToOring: { fa: "برآورد اورینگ از روی شیار", en: "Gland Groove to O-Ring" },
  tabGlandToOringDesc: { fa: "یافتن دش‌نامبر از روی ابعاد شیار", en: "Find matching O-Ring from machined groove" },
  tabMaterialGuide: { fa: "راهنمای متریال (NBR/Viton)", en: "Material Compatibility Guide" },
  tabMaterialGuideDesc: { fa: "تحمل دما و مقاومت اسیدی الاستومرها", en: "Elastomer temperature & chemicals" },

  // Shared Terminology
  dashNo: { fa: "دش نامبر (Dash No.)", en: "Dash Number (Dash No.)" },
  innerDiameter: { fa: "قطر داخلی (ID)", en: "Inner Diameter (ID)" },
  crossSection: { fa: "ضخامت مفتول (CS)", en: "Cross Section (CS)" },
  tolerance: { fa: "تلرانس", en: "Tolerance" },
  inch: { fa: "اینچ", en: "Inches" },
  mm: { fa: "میلی‌متر", en: "Millimeters" },
  activeLanguage: { fa: "زبان", en: "Language" },
  activeTheme: { fa: "تم رنگی و دیزاین", en: "Color Theme & Design" },
  back: { fa: "بازگشت", en: "Back" },
  close: { fa: "بستن", en: "Close" },
  allSeries: { fa: "همه سری‌ها", en: "All Series" },
  nominalSize: { fa: "سایز اسمی", en: "Nominal Size" },
  actualSize: { fa: "ابعاد دقیق مهندسی", en: "Actual Engineering Sizes" },
  dimensions: { fa: "ابعاد", en: "Dimensions" },
  searchLabel: { fa: "جستجو و فیلتر", en: "Search & Filter" },
  exampleText: { fa: "مثال:", en: "Example:" },

  // Dash to Size Tab
  searchDashPlaceholder: { fa: "مثال: 010 یا 214", en: "e.g., 010 or 214" },
  seriesExplain000: { fa: "سری 000 (توضیح ۱.۷۸ میلی‌متر)", en: "000 Series (1.78 mm CS)" },
  seriesExplain100: { fa: "سری 100 (توضیح ۲.۶۲ میلی‌متر)", en: "100 Series (2.62 mm CS)" },
  seriesExplain200: { fa: "سری 200 (توضیح ۳.۵۳ میلی‌متر)", en: "200 Series (3.53 mm CS)" },
  seriesExplain300: { fa: "سری 300 (توضیح ۵.۳۳ میلی‌متر)", en: "300 Series (5.33 mm CS)" },
  seriesExplain400: { fa: "سری 400 (توضیح ۶.۹۹ میلی‌متر)", en: "400 Series (6.99 mm CS)" },
  seriesExplain900: { fa: "سری 900 (مخصوص اتصالات رزوه)", en: "900 Series (Straight Thread Boss)" },
  visualSchematic: { fa: "ترسیم و مقیاس نقشه فنی اورینگ", en: "O-Ring Isometric CAD View" },
  nominalId: { fa: "قطر داخلی نامی", en: "Nominal ID" },
  idStandardField: { fa: "قطر داخلی استاندارد (ID)", en: "Standard ID" },
  csStandardField: { fa: "ضخامت استاندارد مفتول (CS)", en: "Standard CS" },
  outerDiameterLabel: { fa: "قطر خارجی محاسبه‌شده (OD)", en: "Calculated Outer Diameter (OD)" },
  showNominalSpec: { fa: "مشاهده سایزهای اسمی کسری", en: "Show Nominal Fractional Specs" },

  // Size to Dash Tab
  unitToggleTo: { fa: "تغییر واحد به", en: "Change unit to" },
  inputPieceSize: { fa: "ورود ابعاد قطعه کار", en: "Input Workspace Dimensions" },
  requiredMeasurement: { fa: "اندازه‌گیری قطر شیار یا اورینگ موجود به همراه ضخامت جهت انطباق‌یابی دقیق:", en: "Measure existing O-Ring or groove dimensions for high-precision matching:" },
  measuredId: { fa: "قطر داخلی اندازه‌گیری شده", en: "Measured Inner Diameter" },
  measuredCs: { fa: "ضخامت مفتول اندازه‌گیری شده", en: "Measured Cross Section" },
  perfectMatch: { fa: "انطباق دقیق پیدا شد!", en: "Perfect Standard Match Found!" },
  closeMatchWarning: { fa: "عدم انطباق صد در صد: نمایش نزدیک‌ترین اندازه‌ها", en: "No direct match: Showing closest standards" },
  closestDashResults: { fa: "نزدیک‌ترین گریدهای استاندارد AS568", en: "Closest AS568 Standard Matches" },
  deviationScore: { fa: "انحراف از سایز هدف:", en: "Deviation from Target:" },
  noMatchYet: { fa: "لطفاً مقادیر بزرگتر از صفر وارد کنید تا نزدیک‌ترین کدهای استاندارد تحلیل شوند.", en: "Please enter values greater than zero in the CS & ID inputs to analyze math." },
  squeezeRatioLabel: { fa: "درصد فشردگی استاتیک بهینه", en: "Optimum Static Squeeze" },
  installationStretch: { fa: "درصد کشش نصب مجاز", en: "Permissible Installation Stretch" },

  // Gland Design Tab
  glandHeader: { fa: "استاندارد طراحی شیار (O-Ring Gland Design)", en: "Gland Groove Design Standard" },
  glandExplain: { fa: "جهت بهینه‌سازی فرآیند آب‌بندی تحت فشار و جلوگیری از لهیدگی یا نشتی، شیار اورینگ پس از تراشکاری دقیق شفت در مدل‌های رفت و برگشتی یا ثابت باید این ابعاد را داشته باشد:", en: "To optimize pressure-tight sealing and prevent blowout, the elastomer groove machined on the shaft or piston housing should strictly follow these dimensions:" },
  selectNominalCs: { fa: "انتخاب ضخامت نامی اورینگ (CS):", en: "Select Nominal O-Ring thickness (CS):" },
  schematicTitle: { fa: "نقشه فنی شماتیک شیار اورینگ روی شفت", en: "Shaft O-Ring Groove Schematic Design" },
  depthSymbol: { fa: "h: عمق نشیمنگاه شیار (Depth)", en: "h: Gland Housing Depth" },
  widthSymbol: { fa: "b: پهنای کل شیار (Width)", en: "b: Gland Groove Width" },
  tableTitle: { fa: "جداول پیشنهادی عمق شیار و تلرانس‌ها", en: "Recommended Gland Tolerances" },
  tableSubtitle: { fa: "توصیه‌های فنی قالب‌سازی و ماشین‌کاری هوزینگ اورینگ اریکس با ابعاد", en: "Technical machining rules for Eriks O-ring gland sizes" },
  staticSeal: { fa: "آب‌بندی استاتیک (Static Seal)", en: "Static Seal (Fixed)" },
  staticSealDesc: { fa: "اتصلات پایدار و ثابت", en: "Stable & fixed connections" },
  dynamicSeal: { fa: "آب‌بندی دینامیک (Dynamic Seal)", en: "Dynamic Seal (Reciprocating)" },
  dynamicSealDesc: { fa: "رفت و برگشتی / چرخشی", en: "Pistons / Rotary motion" },
  grooveDepthH: { fa: "عمق متداول شیار (h):", en: "Recommended Groove Depth (h):" },
  grooveWidthB: { fa: "پهنای متداول شیار (b):", en: "Recommended Groove Width (b):" },
  squeezePercent: { fa: "درصد فشردگی (Squeeze %):", en: "Squeeze Ratio (Squeeze %):" },
  staticExtraExplain: { fa: "به دلیل عدم وجود سایش و فرسایش، درصد فشردگی در هوزینگ ثابت بسیار بالاتر تراش خورده تا ضریب نشت گاز به صفر نزدیک‌تر شود.", en: "Since there is no frictional sliding, the squeeze ratio is set high in stationary joints to eliminate gas and fluid micro-leakages." },
  dynamicExtraExplain: { fa: "در جک‌های رفت و برگشتی، فشردگی کمتر لحاظ می‌شود تا گرمای حاصل از مالش قطعه کاهش‌یافته و لاستیک اورینگ پودر یا تکه‌تکه نگردد.", en: "In reciprocating rods or cylinders, less compression is applied to limit heat build-up and avoid dusting, extrusion, or physical tearing." },

  // Gland to O-Ring Tab
  analyzedGlandSpec: { fa: "آنالیز ابعاد شیار ترشکاری شده", en: "Machined Gland Dimensions Analysis" },
  requiredGlandInputs: { fa: "ابعاد واقعی شیار فعلی دستگاه یا شفت خود را وارد کنید تا بهترین کاندیداهای اورینگ استاندارد جهان بررسی شوند:", en: "Enter the dimensions of your existing physical gland or shaft groove to find the best-matched world standard O-rings:" },
  measuredGrooveDia: { fa: "قطر خارجی شیار شفت (Groove Dia)", en: "Piston Groove Diameter" },
  measuredGrooveDepth: { fa: "عمق شیار تراش‌خورده (Depth - h)", en: "Measured Groove Depth (h)" },
  measuredGrooveWidth: { fa: "عرض کل شیار (Width - b)", en: "Measured Groove Width (b)" },
  glandPosition: { fa: "موقعیت آب‌بندی هوزینگ:", en: "Gland Application Type:" },
  positionPiston: { fa: "شیار روی شفت (پیستون)", en: "Groove on Shaft (Piston)" },
  positionRod: { fa: "شیار داخل سوراخ (ثابت/سیلندر)", en: "Groove inside Hole (Rod/Bore)" },
  movementTypeLabel: { fa: "کاربری حرکتی قطعه:", en: "Motion Profile Type:" },
  movementStatic: { fa: "آب‌بندی ثابت (استاتیک)", en: "Stationary Seal (Static)" },
  movementDynamic: { fa: "آب‌بندی لغزنده (دینامیک)", en: "Sliding Joint (Dynamic)" },
  rankIndex: { fa: "رتبه انطباق:", en: "Match Compatibility Grade:" },
  squeezeCalculated: { fa: "فشردگی حاصل:", en: "Resulting Squeeze:" },
  stretchCalculated: { fa: "کشش بر روی شیار:", en: "Interference Stretch on Groove:" },
  glandAnalysisReport: { fa: "گزارش وضعیت کیفی بهینه‌سازی:", en: "Quality and Optimization Report:" },
  glandPerfectFit: { fa: "فوق‌العاده! این اورینگ کاملاً با تلرانس کلاس A هماهنگ است و نهایتاً آب‌بندی مطمئنی می‌دهد.", en: "Excellent! This O-ring matches the Class A tolerances perfectly, guaranteeing a tight & durable sealing grip." },
  glandLowSqueeze: { fa: "اخطار: درصد فشردگی بسیار پایین است. خطر نشتی سیال در فشارهای فراتر از ۵ بار وجود دارد.", en: "Warning: Squeeze ratio is extremely low. High risk of fluid bypass/leakage for system pressures exceeding 5 bar." },
  glandExtremeSqueeze: { fa: "هشدار: فشردگی بیش از حد مجاز است! ممکن است اورینگ حین جازدن تکه یا قیچی شود.", en: "Danger: Extremely high compression squeeze. The elastomer might get cut or sheared during installation." },
  glandNoMatches: { fa: "هیچ گرید اورینگ استانداردی با این عمق و ابعاد همخوانی کارکردی ندارند. پیشنهاد می‌شود ابعاد شیار اصلاح گردد.", en: "No standard AS568 O-ring candidate matches these groove depth dimensions. Modifying the metal gland is advised." },

  // Material Compatibility Tag
  materialPropsHeader: { fa: "خواص فیزیکی و شیمیایی الاستومرها", en: "Chemical & Physical Elastomer Specs" },
  materialRatingLegend: { fa: "بازه کارکرد دمایی ایمن (Service Temperature Range)", en: "Continuous Service Temperature Limits" },
  materialHardness: { fa: "سختی:", en: "Hardness:" },
  materialNBR: { fa: "ان‌بی‌آر (نیتریل)", en: "NBR (Nitrile Rubber)" },
  materialViton: { fa: "وایتون (فلوروکربن FKM)", en: "Viton (FKM Fluorocarbon)" },
  materialSilicone: { fa: "سیلیکون (VMQ)", en: "Silicone (VMQ Elastomer)" },
  materialEPDM: { fa: "ای‌پی‌دی‌ام (ضد اسید)", en: "EPDM (Acid/Steam Proof)" },
  advantagesLabel: { fa: "نقاط قوت و مزیت‌ها:", en: "Key Advantages & Strengths:" },
  disadvantagesLabel: { fa: "نقاط ضعف و محدودیت‌ها:", en: "Operational Limitations & Flaws:" },
  applicationsLabel: { fa: "کاربردهای متداول مهندسی:", en: "Common Industrial Applications:" },

  // Docs Section
  docsTitle: { fa: "راهنما و مراجع مهندسی استاندارد هوا وفضا AS568", en: "Engineering Help & AS568 Aerospace Standard Guide" },
  whatIsTitle: { fa: "استاندارد AS568 چیست؟", en: "What is the AS568 standard?" },
  whatIsDesc: { fa: "استاندارد AS568 (مخفف Aerospace Standard) تدوین‌شده توسط انجمن مهندسان خودرو (SAE) آمریکا است. این مرجع، سایزبندی بین‌المللی و گام‌های هندسی اورینگ‌های کلاسیک صنعتی را مشخص می‌کند تا قطعات ساخت برندهایی چون Eriks، Parker و Busak+Shamban کدهای یکسانی داشته باشند.", en: "The AS568 (Aerospace Standard) is defined by the Society of Automotive Engineers (SAE) of America. It specifies the worldwide metric and imperial size codes and geometric steps for classic industrial O-rings, ensuring identical sizing across global makers like Eriks, Parker, and Busak+Shamban." },
  readingTitle: { fa: "نحوه خوانش کدها:", en: "How code numbers are read:" },
  readingDesc: { fa: "دش‌نامبرهای ۳ رقمی به گروه‌های مختلف تقسیم می‌شوند. رقم اول مشخص‌کننده ضخامت مفتول (مقطع) است. کدهای سری ۹۰۰ (مثال: ۹۰۸) نماینده اورینگ‌های مورد استفاده در آب‌بندی اتصالات هیدرولیک مستقیم (رزوه مستقیم) هستند که مشخصات و تلرانس‌های بسیار ظریف‌تری نسبت به سری عمومی عایق‌ب بندی فیزیکی دارند.", en: "Three-digit dash numbers are grouped by cross-section thickness. The first number denotes standard wire caliper thickness. The 900 series (e.g., 908) indicates high-precision O-rings designed specifically for straight-thread tube styling or hydraulic fittings, featuring ultra-fine tolerances relative to general fluid seals." },
  safeSealTitle: { fa: "پیشنهاد آب‌بندی ایمن:", en: "Safe Sealing Best Practices:" },
  safeSealDesc: { fa: "در تجهیزات هیدرولیکی فشار بالا همواره توصیه می‌شود از اورینگ‌هایی با درصد خلوص عالی و ضریب سختی بالا (مثلاً ۹۰ Shore A) استفاده شود. برای مایعات فرساینده و خورنده اسیدی، حتماً گزینه وایتون (FKM) و برای مصارف بهداشتی، گازهای آرگون یا کارخانجات داروسازی از متریال سیلیکون بهره ببرید.", en: "In high-pressure hydraulic circuitry, we recommend high-durometer elastomers (e.g. 90 Shore A). For severe chemicals, hot steam, and organic acids, prefer Viton (FKM); for pharmaceuticals, food safety, and extreme cold, rely on Silicone or USP-class FDA polymers." }
};

export interface AppContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: keyof typeof dictionary, defaultVal?: string) => string;
  colors: ThemeColors;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("oring_lang");
    return (saved as Language) || "fa";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("oring_theme");
    return (saved as Theme) || "slate-blue";
  });

  useEffect(() => {
    localStorage.setItem("oring_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("oring_theme", theme);
  }, [theme]);

  // Translation utility
  const t = (key: keyof typeof dictionary, defaultVal?: string): string => {
    const term = dictionary[key];
    if (!term) return defaultVal || key;
    return term[lang] || defaultVal || key;
  };

  const colors = themeMap[theme];

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t, colors }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
