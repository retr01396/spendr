import React from 'react';
import './LandingPage.css';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { Section2 } from './Section2';
import { Section3 } from './Section3';
import { Section4 } from './Section4';
import { Section5 } from './Section5';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: '#050507', color: '#ffffff' }}
    >
      {/* Sticky nav */}
      <LandingNav onEnterApp={onEnterApp} />

      {/* Hero */}
      <HeroSection onEnterApp={onEnterApp} />

      {/* Section divider */}
      <div className="red-line mx-auto max-w-5xl opacity-30" />

      {/* Sections */}
      <Section2 />

      <div className="red-line mx-auto max-w-5xl opacity-20" />

      <Section3 />

      <div className="red-line mx-auto max-w-5xl opacity-20" />

      <Section4 />

      <div className="red-line mx-auto max-w-5xl opacity-20" />

      <Section5 onEnterApp={onEnterApp} />

      {/* Footer */}
      <footer className="border-t border-[#111116] px-6 py-10 text-center">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black"
              style={{
                border: '1px solid rgba(229,9,20,0.4)',
                background: '#0A0A0C',
                color: '#E50914',
              }}
            >
              S
            </div>
            <span className="text-xs font-black tracking-[0.28em] text-[#333344]">SPENDR</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#222230]">
            Know Where Your Money Goes · Est. 2025
          </p>
        </div>
      </footer>
    </div>
  );
};
