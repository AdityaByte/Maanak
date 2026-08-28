import React from 'react';
import HeroSection from './components/HeroSection';
import Overview from './components/Overview/Overview';

export default function DashboardPage() {
  return (
    <div className="w-full">
      <HeroSection />

      <Overview/>
       <div className="h-[2000px]" /> {/* remove after testing */}
    </div>
  );
}