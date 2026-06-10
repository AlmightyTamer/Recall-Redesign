import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  name: string;
  age: number;
  city: string;
  caregiverName: string;
  caregiverRelationship: string;
  caregiverPhone?: string;
  familyPhotoUrl?: string;
  calmingMusicUrl?: string;
  medications: Medication[];
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: string[]; // e.g. ["8:00 AM", "8:00 PM"]
}

export interface Event {
  id?: number;
  userId: number;
  timestamp: string;
  type: 'user_action' | 'planned' | 'caregiver_input' | 'system_alert';
  title: string;
  description: string;
  completed: boolean;
  source: string;
}

export interface MedicationLog {
  id?: number;
  userId: number;
  medicationName: string;
  timestamp: string;
  visionConfidence: 'high' | 'medium' | 'low' | 'manual' | 'unconfirmed';
  visionDescription: string;
  imageThumbnail?: string;
  confirmed: boolean;
}

export interface AcseScore {
  id?: number;
  userId: number;
  score: number;
  timestamp: string;
  reason?: string;
}

export interface SupervisorAlertRecord {
  id?: number;
  userId: number;
  message: string;
  timestamp: string;
  type: 'comfort_mode' | 'medication_unconfirmed' | 'general' | 'presence';
  dismissed: boolean;
}

export interface MemoryAnchorRecord {
  id?: number;
  userId: number;
  title: string;
  emoji: string;
  anchorText: string;
  speakText: string;
  generatedAt: string;
}

class RecallDB extends Dexie {
  users!: Table<User>;
  events!: Table<Event>;
  medicationLogs!: Table<MedicationLog>;
  acseScores!: Table<AcseScore>;
  supervisorAlerts!: Table<SupervisorAlertRecord>;
  memoryAnchors!: Table<MemoryAnchorRecord>;

  constructor() {
    super('RecallDB');
    this.version(1).stores({
      users: '++id, name',
      events: '++id, userId, timestamp, type, completed',
      medicationLogs: '++id, userId, medicationName, timestamp',
      acseScores: '++id, userId, timestamp',
    });
    this.version(2).stores({
      users: '++id, name',
      events: '++id, userId, timestamp, type, completed',
      medicationLogs: '++id, userId, medicationName, timestamp',
      acseScores: '++id, userId, timestamp',
      supervisorAlerts: '++id, userId, timestamp, dismissed',
      memoryAnchors: '++id, userId, generatedAt',
    });
  }
}

export const db = new RecallDB();
