"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    try {
      // 1. Apply saved theme
      const savedTheme = localStorage.getItem("theme");
      const isDark =
        savedTheme === "dark" ||
        (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);

      // 2. Apply saved accent color
      const savedAccent = localStorage.getItem("maanak_accent_color") || "blue";
      document.documentElement.setAttribute("data-theme-color", savedAccent);

      // 3. Apply saved font size scale
      const savedFontSize = localStorage.getItem("maanak_font_size") || "comfortable";
      document.documentElement.setAttribute("data-font-size", savedFontSize);

      // 4. Apply reduced motion
      const savedReducedMotion = localStorage.getItem("maanak_reduced_motion");
      if (savedReducedMotion === "true") {
        document.documentElement.setAttribute("data-reduced-motion", "true");
      } else {
        document.documentElement.removeAttribute("data-reduced-motion");
      }
    } catch {
      // Ignore in non-browser context
    }
  }, []);

  return null;
}
