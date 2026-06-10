const CHANNEL_NAME = 'recall-presence';
const PULSE_TTL_MS = 90_000;

export interface PresencePulse {
  patientId: number;
  caregiverName: string;
  at: number;
}

function storageKey(patientId: number): string {
  return `recall-pulse-${patientId}`;
}

export function sendPresencePulse(patientId: number, caregiverName: string): void {
  const pulse: PresencePulse = { patientId, caregiverName, at: Date.now() };
  try {
    localStorage.setItem(storageKey(patientId), JSON.stringify(pulse));
  } catch {
    /* ignore */
  }
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(pulse);
    channel.close();
  } catch {
    /* ignore */
  }
}

export function readStoredPulse(patientId: number): PresencePulse | null {
  try {
    const raw = localStorage.getItem(storageKey(patientId));
    if (!raw) return null;
    const pulse = JSON.parse(raw) as PresencePulse;
    if (Date.now() - pulse.at > PULSE_TTL_MS) return null;
    return pulse;
  } catch {
    return null;
  }
}

export function subscribePresence(
  patientId: number,
  onPulse: (pulse: PresencePulse) => void
): () => void {
  const handle = (pulse: PresencePulse) => {
    if (pulse.patientId === patientId && Date.now() - pulse.at < PULSE_TTL_MS) {
      onPulse(pulse);
    }
  };

  const stored = readStoredPulse(patientId);
  if (stored) onPulse(stored);

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e: MessageEvent<PresencePulse>) => handle(e.data);
  } catch {
    /* ignore */
  }

  const poll = window.setInterval(() => {
    const p = readStoredPulse(patientId);
    if (p) onPulse(p);
  }, 4000);

  return () => {
    window.clearInterval(poll);
    channel?.close();
  };
}
