import { useEffect, useState } from 'react';
import { subscribePresence, type PresencePulse as Pulse } from '../lib/presence';
import { useAppStore } from '../store/appStore';
import StudioIcon from './StudioIcon';

/** Patient-side: shows when caregiver sends warmth across tabs/devices */
export default function PresencePulseBanner() {
  const user = useAppStore((s) => s.user);
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    return subscribePresence(user.id, (p) => setPulse(p));
  }, [user?.id]);

  useEffect(() => {
    if (!pulse) return;
    const remaining = 90_000 - (Date.now() - pulse.at);
    if (remaining <= 0) {
      setPulse(null);
      return;
    }
    const t = window.setTimeout(() => setPulse(null), remaining);
    return () => window.clearTimeout(t);
  }, [pulse]);

  if (!pulse) return null;

  return (
    <div className="presence-pulse" role="status" aria-live="polite">
      <div className="presence-pulse__ring" aria-hidden />
      <div className="presence-pulse__ring presence-pulse__ring--2" aria-hidden />
      <StudioIcon name="heart" size={20} />
      <span>
        <strong>{pulse.caregiverName}</strong> is thinking of you right now
      </span>
    </div>
  );
}
