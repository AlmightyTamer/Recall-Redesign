export interface VitalReading {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'watch' | 'alert';
  trend: 'stable' | 'up' | 'down';
  detail?: string;
  sparkline: number[];
}

export interface OrthostaticBP {
  position: 'Sitting' | 'Standing';
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
}

export interface VitalsSnapshot {
  recordedAt: string;
  heartRate: VitalReading;
  respiratoryRate: VitalReading;
  weightBmi: VitalReading;
  bodyTemp: VitalReading;
  orthostatic: OrthostaticBP[];
  orthostaticNote: string;
  isDemo: true;
}

function spark(base: number, variance: number, points = 12): number[] {
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin(i * 0.9) * variance * 0.4;
    const drift = (i - points / 2) * (variance * 0.05);
    return Math.round(base + wave + drift);
  });
}

function seedFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Stable demo vitals — values stay consistent per patient name (labeled demo in UI) */
export function getPatientVitals(patientName = 'Margaret'): VitalsSnapshot {
  const seed = seedFromName(patientName);
  const hr = 72 + (seed % 6);
  const rr = 16 + (seed % 2);
  const weight = 140 + (seed % 8);
  const heightIn = 64;
  const bmi = Math.round((weight / (heightIn * heightIn)) * 703 * 10) / 10;
  const temp = 98.1 + (seed % 5) * 0.1;

  const sittingSys = 126 + (seed % 6);
  const sittingDia = 76 + (seed % 4);
  const standingSys = sittingSys - 10;
  const standingDia = sittingDia - 6;

  return {
    recordedAt: new Date().toISOString(),
    isDemo: true,
    heartRate: {
      label: 'Heart Rate',
      value: String(hr),
      unit: 'bpm',
      status: hr > 100 || hr < 55 ? 'watch' : 'normal',
      trend: 'stable',
      detail: 'Resting, regular rhythm',
      sparkline: spark(hr, 6),
    },
    respiratoryRate: {
      label: 'Respiratory Rate',
      value: String(rr),
      unit: '/min',
      status: rr > 20 ? 'watch' : 'normal',
      trend: 'stable',
      detail: 'Calm, unlabored breathing',
      sparkline: spark(rr, 2),
    },
    weightBmi: {
      label: 'Weight / BMI',
      value: `${weight} lb`,
      unit: `BMI ${bmi}`,
      status: bmi >= 25 ? 'watch' : 'normal',
      trend: 'down',
      detail: `${patientName} — stable over 30 days`,
      sparkline: spark(weight, 3),
    },
    bodyTemp: {
      label: 'Body Temperature',
      value: temp.toFixed(1),
      unit: '°F',
      status: temp >= 100.4 ? 'alert' : temp >= 99.5 ? 'watch' : 'normal',
      trend: 'stable',
      detail: 'Oral, morning reading',
      sparkline: spark(Math.round(temp * 10), 3).map((v) => v / 10),
    },
    orthostatic: [
      {
        position: 'Sitting',
        systolic: sittingSys,
        diastolic: sittingDia,
        pulse: hr,
        time: '8:15 AM',
      },
      {
        position: 'Standing',
        systolic: standingSys,
        diastolic: standingDia,
        pulse: hr + 8,
        time: '8:17 AM',
      },
    ],
    orthostaticNote:
      sittingSys - standingSys >= 20
        ? 'Mild orthostatic drop — monitor on standing'
        : 'Orthostatic response within expected range',
  };
}

export function statusColor(status: VitalReading['status']): string {
  if (status === 'alert') return '#EF4444';
  if (status === 'watch') return '#F59E0B';
  return '#10B981';
}
