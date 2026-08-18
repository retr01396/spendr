import React from 'react';
import { useScrollAnimation } from './useScrollAnimation';

export const Section2: React.FC = () => {
  const heading = useScrollAnimation(0.14);
  const body = useScrollAnimation(0.14);
  const cards = useScrollAnimation(0.1);

  return (
    <section
      className="relative overflow-hidden px-6 py-36"
      aria-label="One place for every subscription"
    >
      {/* Atmospheric red tint — left side */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
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
            Subscriptions
          </span>
        </div>

        {/* Main headline */}
        <h2
          ref={heading.ref}
          className={`scroll-hidden heading-metallic text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          ONE PLACE FOR
          <br />
          EVERY SUBSCRIPTION.
        </h2>

        {/* Body text */}
        <div
          ref={body.ref}
          className={`scroll-hidden mt-8 max-w-xl ${body.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '160ms' }}
        >
          <p className="text-lg leading-relaxed text-[#8888A0]">
            Track recurring payments, renewal dates, and monthly spending without digging through
            bank statements.
          </p>
        </div>

        {/* Red separator */}
        <div
          ref={body.ref}
          className={`scroll-hidden mt-10 ${body.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '220ms' }}
        >
          <div className="red-line w-24" />
        </div>

        {/* Feature pills */}
        <div
          ref={cards.ref}
          className={`scroll-hidden mt-16 grid gap-4 sm:grid-cols-3 ${cards.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '300ms' }}
        >
          {[
            { label: 'Recurring Payments', desc: 'Every charge, tracked automatically.' },
            { label: 'Renewal Dates', desc: 'Know exactly when you\'re billed next.' },
            { label: 'Monthly Totals', desc: 'See your real cost at a glance.' },
          ].map(({ label, desc }, i) => (
            <div
              key={label}
              className="glass-surface rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(229,9,20,0.18)]"
              style={{ transitionDelay: `${300 + i * 60}ms` }}
            >
              {/* Red dot accent */}
              <div
                className="mb-4 h-2 w-2 rounded-full bg-[#E50914]"
                style={{ boxShadow: '0 0 8px rgba(229,9,20,0.6)' }}
              />
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">{label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#666680]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
