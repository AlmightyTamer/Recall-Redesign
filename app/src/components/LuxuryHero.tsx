import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

const PARTICLES = [
  { r: 114, start: 0,   dur: 14, sz: 3, sage: false, delay: 0 },
  { r: 106, start: 72,  dur: 11, sz: 2, sage: true,  delay: -2 },
  { r: 118, start: 144, dur: 16, sz: 3, sage: false, delay: -5 },
  { r: 108, start: 216, dur: 13, sz: 2, sage: true,  delay: -8 },
  { r: 112, start: 288, dur: 15, sz: 3, sage: false, delay: -3 },
  { r: 120, start: 36,  dur: 10, sz: 2, sage: false, delay: -6 },
  { r: 104, start: 108, dur: 17, sz: 3, sage: true,  delay: -1 },
  { r: 116, start: 252, dur: 12, sz: 2, sage: false, delay: -9 },
];

interface LuxuryHeroProps {
  greeting: string;
  firstName: string;
  dateLabel: string;
}

export default function LuxuryHero({ greeting, firstName, dateLabel }: LuxuryHeroProps) {
  const acseScore = useAppStore((s) => s.acseScore);
  const moodLabel =
    acseScore >= 75 ? 'mind at ease' :
    acseScore >= 50 ? 'gentle awareness' :
    'extra care';

  return (
    <div className="luxury-hero">
      <div className="luxury-hero__orb-wrap">
        <div className="luxury-hero__ambient" />
        <div className="luxury-hero__ambient-2" />
        <div className="luxury-hero__ring-outer" />
        <div className="luxury-hero__ring-mid" />
        <div className="luxury-hero__ring-inner" />

        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`luxury-hero__particle${p.sage ? ' luxury-hero__particle--sage' : ''}`}
            style={{
              '--r':     `${p.r}px`,
              '--start': `${p.start}deg`,
              '--dur':   `${p.dur}s`,
              '--sz':    `${p.sz}px`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}

        <div className="luxury-hero__core">
          <span className="luxury-hero__score-num">{acseScore}</span>
          <span className="luxury-hero__score-label">{moodLabel}</span>
        </div>
      </div>

      <div className="luxury-hero__text">
        <p className="luxury-hero__date">{dateLabel}</p>
        <h1 className="luxury-hero__greeting">{greeting}, {firstName}</h1>
      </div>
    </div>
  );
}
