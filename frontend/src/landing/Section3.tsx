import React from 'react';
import { useScrollAnimation } from './useScrollAnimation';

/* Mock subscription data for the visual */
const subscriptions = [
  { name: 'Netflix', category: 'Streaming', amount: 15.99, color: '#E50914' },
  { name: 'Spotify', category: 'Music', amount: 9.99, color: '#1DB954' },
  { name: 'Adobe CC', category: 'Creative', amount: 54.99, color: '#FF0000' },
  { name: 'iCloud', category: 'Storage', amount: 2.99, color: '#007AFF' },
  { name: 'YouTube', category: 'Streaming', amount: 13.99, color: '#FF0000' },
];

const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

export const Section3: React.FC = () => {
  const heading = useScrollAnimation(0.14);
  const visual = useScrollAnimation(0.08);

  return (
    <section
      className="relative overflow-hidden px-6 py-36"
      aria-label="See what you actually spend"
    >
      {/* Atmospheric glow — right side */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(229,9,20,0.06) 0%, transparent 68%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Overline */}
        <div
          ref={heading.ref}
          className={`scroll-hidden-right mb-6 flex items-center justify-end gap-4 ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '0ms' }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#E50914]">
            Analytics
          </span>
          <div className="h-px w-10 bg-[#E50914]" />
        </div>

        {/* Main headline — right-aligned */}
        <h2
          className={`scroll-hidden-right heading-metallic text-right text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          SEE WHAT YOU
          <br />
          ACTUALLY SPEND.
        </h2>

        {/* Spending visual */}
        <div
          ref={visual.ref}
          className={`scroll-hidden mt-16 ${visual.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '180ms' }}
          aria-label="Subscription spending overview"
        >
          <div className="glass-surface overflow-hidden rounded-3xl p-8">
            {/* Header row */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#666680]">
                  Monthly Total
                </p>
                <p className="mt-1 text-4xl font-black tabular-nums text-white">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#666680]">
                  Subscriptions
                </p>
                <p className="mt-1 text-4xl font-black tabular-nums text-white">
                  {subscriptions.length}
                </p>
              </div>
            </div>

            {/* Red separator */}
            <div className="red-line mb-8" />

            {/* Bar visualization */}
            <div className="space-y-4">
              {subscriptions.map((sub, i) => {
                const pct = (sub.amount / subscriptions[0].amount) * 100;
                return (
                  <div
                    key={sub.name}
                    className="flex items-center gap-4"
                    style={{
                      transitionDelay: `${200 + i * 70}ms`,
                      opacity: visual.isVisible ? 1 : 0,
                      transform: visual.isVisible ? 'translateX(0)' : 'translateX(20px)',
                      transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                  >
                    {/* Name */}
                    <div className="w-20 shrink-0">
                      <p className="text-xs font-semibold text-white">{sub.name}</p>
                      <p className="text-[10px] text-[#555568]">{sub.category}</p>
                    </div>

                    {/* Bar track */}
                    <div className="flex-1 rounded-full bg-[#0A0A0C] overflow-hidden h-[6px]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: visual.isVisible ? `${pct}%` : '0%',
                          background: `linear-gradient(90deg, ${sub.color}CC, ${sub.color}55)`,
                          boxShadow: `0 0 8px ${sub.color}55`,
                          transition: `width 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${180 + i * 80}ms`,
                        }}
                      />
                    </div>

                    {/* Amount */}
                    <div className="w-14 shrink-0 text-right">
                      <p className="text-xs font-semibold tabular-nums text-[#E0E0E0]">
                        ${sub.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.22em] text-[#333344]">
              Example data — your real numbers here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
