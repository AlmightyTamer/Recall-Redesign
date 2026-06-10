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
    const el = heroRef.current;
    if (!el) return;
    el.classList.add('apple-hero--visible');
  }, []);

  const scoreLabel = acseScore >= 80 ? 'Great' : acseScore >= 60 ? 'Good' : 'Rest';
  const scoreColor = acseScore >= 80 ? '#30d158' : acseScore >= 60 ? '#ffd60a' : '#ff453a';

  return (
    <div className="apple-hero" ref={heroRef}>
      <p className="apple-hero__date">{dateLabel}</p>
      <h1 className="apple-hero__greeting">
        {greeting},<br />{firstName}.
      </h1>
      <div className="apple-hero__badge" style={{ '--score-color': scoreColor } as React.CSSProperties}>
        <span className="apple-hero__badge-dot" />
        <span className="apple-hero__badge-label">{scoreLabel} · {acseScore}</span>
      </div>
      <div className="apple-hero__rule" />
    </div>
  );
}
