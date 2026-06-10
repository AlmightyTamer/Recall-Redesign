import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

interface Props {
  greeting: string;
  firstName: string;
  dateLabel: string;
}

export default function AppleHero({ greeting, firstName, dateLabel }: Props) {
  const { acseScore } = useAppStore();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      heroRef.current?.classList.add('wm-hero--visible');
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const scoreColor = acseScore >= 80 ? '#34D399' : acseScore >= 60 ? '#F5A623' : '#F87171';
  const scoreLabel = acseScore >= 80 ? 'Great' : acseScore >= 60 ? 'Good' : 'Rest';

  // SVG circle ring for score
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (acseScore / 100) * circ;

  return (
    <div className="wm-hero" ref={heroRef}>
      <div className="wm-hero__left">
        <p className="wm-hero__date">{dateLabel}</p>
        <h1 className="wm-hero__greeting">
          {greeting},<br />
          <span className="wm-hero__name">{firstName}.</span>
        </h1>
      </div>
      <div className="wm-hero__ring">
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle
            cx="34" cy="34" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="4"
          />
          <circle
            cx="34" cy="34" r={r}
            fill="none"
            stroke={scoreColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={circ / 4}
            style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)`, transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="wm-hero__ring-inner">
          <span className="wm-hero__score" style={{ color: scoreColor }}>{acseScore}</span>
          <span className="wm-hero__score-label">{scoreLabel}</span>
        </div>
      </div>
    </div>
  );
}
