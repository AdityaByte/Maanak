"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/redux/standardsSlice";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Eye,
  SlidersHorizontal,
  Bot,
  Trash2,
  RotateCcw,
  CheckCircle2,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";

const ACCENT_COLORS = [
  { id: "blue", name: "BIS Blue", hex: "#2563eb", bgClass: "bg-blue-600" },
  { id: "emerald", name: "Emerald", hex: "#059669", bgClass: "bg-emerald-600" },
  { id: "indigo", name: "Indigo Violet", hex: "#6366f1", bgClass: "bg-indigo-600" },
  { id: "amber", name: "Amber Saffron", hex: "#d97706", bgClass: "bg-amber-600" },
  { id: "rose", name: "Crimson Rose", hex: "#e11d48", bgClass: "bg-rose-600" },
];

const BIS_CATEGORIES = [
  "All",
  "Chemical (CHD)",
  "Civil Engineering (CED)",
  "Electrotechnical (ETD)",
  "Electronics & Information Technology (LITD)",
  "Food & Agriculture (FAD)",
  "Mechanical Engineering (MED)",
  "Management & Systems (MSD)",
  "Metallurgical Engineering (MTD)",
  "Petroleum, Coal & Related (PCD)",
  "Production & General Engineering (PGD)",
  "Textiles (TXD)",
  "Water Resources (WRD)",
];

export default function SettingsPage() {
  const dispatch = useDispatch();

  // Frontend Preferences State
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [accentColor, setAccentColor] = useState("blue");
  const [fontSize, setFontSize] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [defaultCategory, setDefaultCat] = useState("All");

  const [isClient, setIsClient] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  // 1. Load preferences on mount
  useEffect(() => {
    setIsClient(true);
    try {
      // Theme
      const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
      setTheme(savedTheme);

      // Accent Color
      const savedAccent = localStorage.getItem("maanak_accent_color") || "blue";
      setAccentColor(savedAccent);

      // Font Size
      const savedFontSize = (localStorage.getItem("maanak_font_size") as "compact" | "comfortable" | "spacious") || "comfortable";
      setFontSize(savedFontSize);

      // Reduced Motion
      const savedReducedMotion = localStorage.getItem("maanak_reduced_motion") === "true";
      setReducedMotion(savedReducedMotion);

      // View Mode
      const savedViewMode = (localStorage.getItem("maanak_view_mode") as "grid" | "list") || "grid";
      setViewMode(savedViewMode);

      // Default Category
      const savedCategory = localStorage.getItem("maanak_default_category") || "All";
      setDefaultCat(savedCategory);
    } catch {
      // Fallback to defaults
    }

    // Listen for external theme changes (e.g. from TopNavbar)
    const handleGlobalThemeChange = () => {
      const currentTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
      setTheme(currentTheme);
    };

    window.addEventListener("maanak-theme-change", handleGlobalThemeChange);
    return () => {
      window.removeEventListener("maanak-theme-change", handleGlobalThemeChange);
    };
  }, []);

  // 2. Change Theme
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);

    // Notify TopNavbar
    window.dispatchEvent(
      new CustomEvent("maanak-theme-change", { detail: { theme: newTheme } })
    );

    showToast(`Theme updated to ${newTheme === "system" ? "System Default" : newTheme.toUpperCase()}`);
  };

  // 3. Change Accent Color
  const handleAccentChange = (colorId: string) => {
    setAccentColor(colorId);
    localStorage.setItem("maanak_accent_color", colorId);
    document.documentElement.setAttribute("data-theme-color", colorId);
    showToast(`Accent color updated to ${ACCENT_COLORS.find((c) => c.id === colorId)?.name}`);
  };

  // 4. Change Font Size
  const handleFontSizeChange = (size: "compact" | "comfortable" | "spacious") => {
    setFontSize(size);
    localStorage.setItem("maanak_font_size", size);
    document.documentElement.setAttribute("data-font-size", size);
    showToast(`UI text scale set to ${size}`);
  };

  // 5. Toggle Reduced Motion
  const handleReducedMotionToggle = (enabled: boolean) => {
    setReducedMotion(enabled);
    localStorage.setItem("maanak_reduced_motion", enabled ? "true" : "false");
    if (enabled) {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduced-motion");
    }
    showToast(enabled ? "Reduced animations enabled" : "Standard animations enabled");
  };

  // 6. Change Default Search View Mode
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("maanak_view_mode", mode);
    showToast(`Search results view set to ${mode.toUpperCase()}`);
  };

  // 7. Change Default BIS Sector
  const handleCategoryChange = (cat: string) => {
    setDefaultCat(cat);
    localStorage.setItem("maanak_default_category", cat);
    dispatch(setSelectedCategory(cat));
    showToast(`Default category set to ${cat}`);
  };

  // 8. Clear AI Chat History
  const handleClearAiChat = () => {
    try {
      sessionStorage.removeItem("maanak_ai_messages");
      sessionStorage.removeItem("maanak_ai_session_id");
      setShowClearModal(false);
      showToast("AI Assistant conversation history cleared.");
    } catch {
      showToast("Failed to clear chat history.");
    }
  };

  // 9. Reset All Settings
  const handleResetAll = () => {
    if (window.confirm("Reset all visual theme, font, and search preferences to defaults?")) {
      handleThemeChange("light");
      handleAccentChange("blue");
      handleFontSizeChange("comfortable");
      handleReducedMotionToggle(false);
      handleViewModeChange("grid");
      handleCategoryChange("All");
      sessionStorage.removeItem("maanak_ai_messages");
      sessionStorage.removeItem("maanak_ai_session_id");
      showToast("All settings reset to defaults.");
    }
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="h-10 w-48 bg-muted rounded-xl animate-pulse mb-8" />
        <div className="h-64 w-full bg-card rounded-2xl border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Frontend Settings &amp; Preferences
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
              Customize the look, typography, theme accents, and behavior of your Maanak application.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-all active:scale-95 self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* ======================================================== */}
        {/* 1. THEME MODE */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              Theme Mode
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch between Light and Dark modes. Changes take effect across the entire page instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: "light", label: "Light Mode", icon: Sun, desc: "Crisp white interface" },
              { id: "dark", label: "Dark Mode", icon: Moon, desc: "Low-light slate dark theme" },
              { id: "system", label: "System Default", icon: Monitor, desc: "Follow OS preference" },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = theme === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleThemeChange(mode.id as any)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{mode.label}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{mode.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. ACCENT COLOR PALETTE */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              Theme Accent Color
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your primary brand accent. Immediately restyles buttons, badges, active tabs, and highlights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {ACCENT_COLORS.map((accent) => {
              const isSelected = accentColor === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => handleAccentChange(accent.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full ${accent.bgClass} shrink-0`} />
                  <span>{accent.name}</span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. TYPOGRAPHY & UI SCALING */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              Interface Font Scaling
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scale the base text size across the application for optimal reading comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: "compact", label: "Compact (14px)", desc: "Dense layout for data auditing" },
              { id: "comfortable", label: "Comfortable (16px)", desc: "Standard balanced size" },
              { id: "spacious", label: "Spacious (17.5px)", desc: "Larger text for easy readability" },
            ].map((size) => {
              const isSelected = fontSize === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => handleFontSizeChange(size.id as any)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-sm font-semibold text-foreground">{size.label}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{size.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. MOTION & SEARCH VIEW DEFAULTS */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Display &amp; Animation Behavior
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure motion effects and search results layout.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Reduced Animations</h3>
                <p className="text-xs text-muted-foreground">
                  Disable transitions and pulse animations for performance and accessibility.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => handleReducedMotionToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Default Search Results View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Default Standards View Layout</h3>
                <p className="text-xs text-muted-foreground">
                  Preferred presentation mode for standards queries.
                </p>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => handleViewModeChange("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "grid"
                      ? "bg-card text-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Card Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "list"
                      ? "bg-card text-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  <span>List View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. DEFAULT BIS CATEGORY FILTER */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Default BIS Standards Sector
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically pre-select your primary engineering sector when browsing or searching standards.
            </p>
          </div>

          <div className="pt-1 max-w-md">
            <select
              value={defaultCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {BIS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Currently active filter: <strong className="text-foreground">{defaultCategory}</strong>
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. AI ASSISTANT SESSION MEMORY */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              AI Assistant Session Storage
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage cached AI chat messages and compliance queries in your browser.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Clear AI Assistant History
              </h3>
              <p className="text-xs text-muted-foreground">
                Permanently erase current chat conversations and session memory from your browser storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              Clear Chat History
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing AI Chat History */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Clear AI Conversation History?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will remove all current chat messages and session memory from your browser storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAiChat}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
              >
                Yes, Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}