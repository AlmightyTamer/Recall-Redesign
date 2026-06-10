import { db } from './db';

function makeTime(base: Date, h: number, m = 0): string {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/** Shift demo events so "upcoming" items stay relevant relative to now */
function demoEventTimes(now: Date): { past: (h: number, m?: number) => string; future: (h: number, m?: number) => string } {
  const hour = now.getHours();

  if (hour < 10) {
    return {
      past: (h, m) => makeTime(now, h, m),
      future: (h, m) => makeTime(now, h, m),
    };
  }
  if (hour < 14) {
    return {
      past: (h, m) => makeTime(now, Math.min(h, hour - 1), m),
      future: (h, m) => makeTime(now, Math.max(h, hour + 1), m),
    };
  }
  return {
    past: (h, m) => makeTime(now, Math.min(h, 11), m),
    future: (h, m) => {
      const target = h <= 12 ? hour + 1 : h;
      return makeTime(now, Math.max(target, hour + 1), m);
    },
  };
}

export async function seedIfEmpty(): Promise<void> {
  const userCount = await db.users.count();
  if (userCount >= 2) return;

  const now = new Date();
  const t = demoEventTimes(now);

  if (userCount === 0) {
    const userId = await db.users.add({
      name: 'Margaret',
      age: 78,
      city: 'Shrewsbury, MA',
      caregiverName: 'Susan',
      caregiverRelationship: 'daughter',
      caregiverPhone: '+15555550142',
      familyPhotoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      calmingMusicUrl: undefined,
      medications: [
        { name: 'Metformin', dosage: '500mg', schedule: ['8:00 AM'] },
        { name: 'Lisinopril', dosage: '10mg', schedule: ['8:00 PM'] },
      ],
      createdAt: now.toISOString(),
    });

    await db.events.bulkAdd([
      {
        userId,
        timestamp: t.past(7, 30),
        type: 'user_action',
        title: 'Breakfast',
        description: 'Margaret had oatmeal and orange juice for breakfast.',
        completed: true,
        source: 'caregiver',
      },
      {
        userId,
        timestamp: t.past(8, 5),
        type: 'user_action',
        title: 'Metformin taken',
        description: 'Margaret took Metformin 500mg. Vision verified.',
        completed: true,
        source: 'system',
      },
      {
        userId,
        timestamp: t.past(9, 15),
        type: 'user_action',
        title: 'Morning walk',
        description: 'Margaret took a 20-minute walk in the garden.',
        completed: true,
        source: 'caregiver',
      },
      {
        userId,
        timestamp: t.future(11, 0),
        type: 'planned',
        title: "Daughter's phone call",
        description: 'Susan will call at 11:00 AM to check in.',
        completed: false,
        source: 'caregiver',
      },
      {
        userId,
        timestamp: t.future(20, 0),
        type: 'planned',
        title: 'Lisinopril — evening dose',
        description: 'Time to take Lisinopril 10mg with a glass of water.',
        completed: false,
        source: 'system',
      },
    ]);

    await db.acseScores.add({
      userId,
      score: 100,
      timestamp: now.toISOString(),
      reason: 'Initial score',
    });

    await db.medicationLogs.add({
      userId,
      medicationName: 'Metformin',
      timestamp: t.past(8, 5),
      visionConfidence: 'high',
      visionDescription: 'Pill bottle clearly visible.',
      confirmed: true,
    });
  }

  if ((await db.users.count()) < 2) {
    const userId2 = await db.users.add({
      name: 'Harold',
      age: 81,
      city: 'Worcester, MA',
      caregiverName: 'James',
      caregiverRelationship: 'son',
      caregiverPhone: '+15555550287',
      familyPhotoUrl: 'https://images.unsplash.com/photo-1566616213894-2d3e1baee564?w=400&h=400&fit=crop',
      calmingMusicUrl: undefined,
      medications: [
        { name: 'Amlodipine', dosage: '5mg', schedule: ['7:00 AM'] },
        { name: 'Donepezil', dosage: '10mg', schedule: ['9:00 PM'] },
      ],
      createdAt: now.toISOString(),
    });

    await db.events.bulkAdd([
      {
        userId: userId2,
        timestamp: t.past(7, 15),
        type: 'user_action',
        title: 'Morning tea',
        description: 'Harold had tea and toast for breakfast.',
        completed: true,
        source: 'caregiver',
      },
      {
        userId: userId2,
        timestamp: t.future(21, 0),
        type: 'planned',
        title: 'Donepezil — evening dose',
        description: 'Time to take Donepezil 10mg before bed.',
        completed: false,
        source: 'system',
      },
    ]);

    await db.acseScores.add({
      userId: userId2,
      score: 92,
      timestamp: now.toISOString(),
      reason: 'Initial score',
    });
  }
}
