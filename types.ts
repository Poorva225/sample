
export interface MedicationInfo {
  uses: string[];
  sideEffects: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timesPerDay: number;
  info?: MedicationInfo;
}

export interface HistoryEntry {
  id: string;
  medicationId: string;
  timestamp: number;
}
