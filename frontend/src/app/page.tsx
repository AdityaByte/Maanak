import React from "react";
import HeroSection from "./components/HeroSection";
import Overview from "./components/Overview/Overview";
import Footer from "./components/Footer";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-10 mx-auto mt-5">
      <HeroSection />
      <Overview />
      <Footer />
    </div>
  );
}