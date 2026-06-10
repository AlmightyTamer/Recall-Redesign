import { useMemo, type CSSProperties } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type AcseScore } from '../db/db';
import StudioIcon from './StudioIcon';

interface HourRisk {
  hour: number;
  label: string;
  risk: 'low' | 'medium' | 'high';
  score: number;
}

/** Predictive cognitive weather — surfaces high-risk hours from ACSE history */
export default function StormRadar({ userId }: { userId?: number }) {
  const scores = useLiveQuery<AcseScore[]>(
    () =>
      userId
        ? db.acseScores.where('userId').equals(userId).toArray()
        : Promise.resolve([] as AcseScore[]),
    [userId]
  );

  const hours = useMemo((): HourRisk[] => {
    const buckets = new Map<number, number[]>();
    for (const s of scores ?? []) {
      const h = new Date(s.timestamp).getHours();
      const arr = buckets.get(h) ?? [];
      arr.push(s.score);
      buckets.set(h, arr);
    }

    const cognitiveDipHours = [14, 15, 16, 20, 21];
    const result: HourRisk[] = [];

    for (let h = 6; h <= 22; h += 2) {
      const vals = buckets.get(h) ?? buckets.get(h - 1) ?? buckets.get(h + 1) ?? [];
      const avg = vals.length
        ? vals.reduce((a, b) => a + b, 0) / vals.length
        : cognitiveDipHours.includes(h) ? 58 : 82;

      const risk: HourRisk['risk'] =
        avg < 55 ? 'high' :
        avg < 72 ? 'medium' :
        'low';

      result.push({
        hour: h,
        label: new Date(2000, 0, 1, h).toLocaleTimeString([], { hour: 'numeric' }),
        risk,
        score: Math.round(avg),
      });
    }
    return result;
  }, [scores]);

  const nextStorm = hours.find((h) => h.risk === 'high' && h.hour >= new Date().getHours());

  return (
    <div className="card storm-radar">
      <div className="storm-radar__header">
        <StudioIcon name="score" size={22} />
        <div>
          <p className="storm-radar__eyebrow">Storm Radar™</p>
          <h3 className="storm-radar__title">Cognitive weather forecast</h3>
        </div>
      </div>

      {nextStorm && (
        <p className="storm-radar__alert">
          Elevated disorientation risk around <strong>{nextStorm.label}</strong> — consider a check-in or Memory Thread review.
        </p>
      )}

      <div className="storm-radar__grid" role="list" aria-label="Hourly cognitive risk">
        {hours.map((h) => (
          <div
            key={h.hour}
            role="listitem"
            className={`storm-radar__cell storm-radar__cell--${h.risk}`}
            title={`${h.label}: estimated stability ${h.score}`}
          >
            <span className="storm-radar__cell-label">{h.label}</span>
            <span className="storm-radar__cell-bar" style={{ '--fill': `${h.score}%` } as CSSProperties} />
          </div>
        ))}
      </div>

      <p className="storm-radar__footnote">
        Blends live ACSE history with circadian patterns common in dementia care.
      </p>
    </div>
  );
}
