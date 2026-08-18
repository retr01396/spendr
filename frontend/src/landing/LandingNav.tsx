import React, { useEffect, useState } from 'react';

interface LandingNavProps {
  onEnterApp: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onEnterApp }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-glass' : 'nav-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-black"
            style={{
              borderColor: 'rgba(229,9,20,0.55)',
              background: '#0A0A0C',
              color: '#E50914',
              boxShadow: '0 0 14px rgba(229,9,20,0.3)',
            }}
          >
            S
          </div>
          <span
            className="text-sm font-black tracking-[0.28em] text-white"
            style={{ letterSpacing: '0.28em' }}
          >
            SPENDR
          </span>
        </div>

        {/* Nav CTA */}
        <button type="button" onClick={onEnterApp} className="cta-btn hidden sm:inline-flex">
          JOIN SPENDR PRO FOR FREE
        </button>

        {/* Mobile CTA — compact */}
        <button
          type="button"
          onClick={onEnterApp}
          className="sm:hidden rounded-lg border px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition"
          style={{
            borderColor: 'rgba(229,9,20,0.55)',
            background: 'rgba(10,10,12,0.85)',
          }}
        >
          Join Free
        </button>
      </div>
    </header>
  );
};
