import React from 'react';
import HeroSection from './components/HeroSection';

export default function DashboardPage() {
  return (
    <div className="w-full">
      <HeroSection />
       <div className="h-[2000px]" /> {/* remove after testing */}
    </div>
  );
}