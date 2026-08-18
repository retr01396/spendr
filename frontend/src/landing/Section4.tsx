import React from 'react';
import { useScrollAnimation } from './useScrollAnimation';

/* Upcoming renewal rows */
const renewals = [
  { name: 'Adobe CC', date: 'Aug 22', daysLeft: 4, urgent: true },
  { name: 'Netflix', date: 'Aug 28', daysLeft: 10, urgent: false },
  { name: 'Spotify', date: 'Sep 3', daysLeft: 16, urgent: false },
  { name: 'iCloud', date: 'Sep 14', daysLeft: 27, urgent: false },
];

/* Calendar grid — 30-day month preview */
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const RENEWAL_DAYS = new Set([22, 28]);

export const Section4: React.FC = () => {
  const heading = useScrollAnimation(0.14);
  const visual = useScrollAnimation(0.08);

  return (
    <section
      className="relative overflow-hidden px-6 py-36"
      aria-label="Never miss a renewal"
    >
      {/* Atmospheric glow — centered */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(229,9,20,0.055) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Overline */}
        <div
          ref={heading.ref}
          className={`scroll-hidden mb-6 flex items-center gap-4 ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '0ms' }}
        >
          <div className="h-px w-10 bg-[#E50914]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#E50914]">
            Renewals
          </span>
        </div>

        {/* Main headline */}
        <h2
          className={`scroll-hidden heading-metallic text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          NEVER MISS
          <br />A RENEWAL.
        </h2>

        {/* Two-column layout */}
        <div
          ref={visual.ref}
          className={`scroll-hidden mt-16 grid gap-6 lg:grid-cols-2 ${visual.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '180ms' }}
        >
          {/* Calendar */}
          <div
            className="glass-surface rounded-3xl p-7"
            aria-label="Calendar view"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                August 2025
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#555568]">
                {RENEWAL_DAYS.size} upcoming
              </p>
            </div>

            {/* Day-of-week headers */}
            <div className="mb-3 grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-[10px] font-semibold uppercase tracking-wide text-[#444454]">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid — starts on Friday (index 5) */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty offset cells for Aug 1 = Friday */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {DAYS.map((day) => {
                const isRenewal = RENEWAL_DAYS.has(day);
                const isToday = day === 18;
                return (
                  <div
                    key={day}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 mx-auto"
                    style={{
                      background: isRenewal
                        ? 'rgba(229,9,20,0.85)'
                        : isToday
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                      color: isRenewal ? '#fff' : isToday ? '#fff' : '#666680',
                      boxShadow: isRenewal ? '0 0 12px rgba(229,9,20,0.55)' : 'none',
                      border: isToday && !isRenewal ? '1px solid rgba(255,255,255,0.15)' : 'none',
                      opacity: visual.isVisible ? 1 : 0,
                      transitionDelay: `${200 + day * 20}ms`,
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-[#E50914]"
                style={{ boxShadow: '0 0 6px rgba(229,9,20,0.6)' }}
              />
              <p className="text-[10px] text-[#555568]">Renewal date</p>
            </div>
          </div>

          {/* Upcoming list */}
          <div className="glass-surface rounded-3xl p-7">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Upcoming Renewals
            </p>
            <div className="space-y-4">
              {renewals.map((renewal, i) => (
                <div
                  key={renewal.name}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: renewal.urgent ? 'rgba(229,9,20,0.07)' : 'rgba(255,255,255,0.03)',
                    border: renewal.urgent
                      ? '1px solid rgba(229,9,20,0.2)'
                      : '1px solid rgba(255,255,255,0.05)',
                    opacity: visual.isVisible ? 1 : 0,
                    transform: visual.isVisible ? 'translateX(0)' : 'translateX(16px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                    transitionDelay: `${250 + i * 90}ms`,
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{renewal.name}</p>
                    <p className="text-xs text-[#555568]">{renewal.date}</p>
                  </div>
                  <div
                    className="rounded-lg px-3 py-1 text-xs font-semibold"
                    style={{
                      background: renewal.urgent ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.05)',
                      color: renewal.urgent ? '#FF6B6B' : '#666680',
                      border: renewal.urgent
                        ? '1px solid rgba(229,9,20,0.3)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {renewal.daysLeft}d
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
