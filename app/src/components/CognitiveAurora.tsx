import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';

export default function CognitiveAurora({ compact = false }: { compact?: boolean }) {
  const acseScore = useAppStore((s) => s.acseScore);

  const mood = useMemo(() => {
    if (acseScore >= 75) return 'calm';
    if (acseScore >= 50) return 'watch';
    return 'storm';
  }, [acseScore]);

  const label =
    mood === 'calm' ? 'Mind at ease' :
    mood === 'watch' ? 'Gentle awareness' :
    'Extra care needed';

  return (
    <div
      className={`cognitive-aurora ${compact ? 'cognitive-aurora--compact' : ''} cognitive-aurora--${mood}`}
      role="img"
      aria-label={`Cognitive state: ${label}, score ${acseScore}`}
    >
      <div className="cognitive-aurora__layer cognitive-aurora__layer--1" />
      <div className="cognitive-aurora__layer cognitive-aurora__layer--2" />
      <div className="cognitive-aurora__layer cognitive-aurora__layer--3" />
      <div className="cognitive-aurora__glow" />
      {!compact && (
        <div className="cognitive-aurora__caption">
          <span className="cognitive-aurora__label">{label}</span>
          <span className="cognitive-aurora__score">{acseScore}</span>
        </div>
      )}
    </div>
  );
}
