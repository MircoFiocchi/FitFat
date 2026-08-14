export type WeightEntry = {
  id: string;
  weight: number;
  date: Date;
  createdAt: Date;
  note: string;
};

export type FirestoreWeightEntry = {
  weight: number;
  date: { seconds: number; nanoseconds: number } | Date;
  createdAt: { seconds: number; nanoseconds: number } | Date;
  note?: string;
};

export type WeightEntryWithChange = WeightEntry & {
  change: number | null;
};

export type WeightSummary = {
  currentWeight: number | null;
  initialWeight: number | null;
  totalChange: number | null;
  weeklyAverageChange: number | null;
};

export type WeeklyWeightSummary = {
  weekLabel: string;
  weekStart: Date;
  weekEnd: Date;
  startWeight: number;
  endWeight: number;
  change: number;
};

export type WeightFormData = {
  weight: string;
  date: string;
  note: string;
};

export type WeightFormErrors = {
  weight?: string;
  date?: string;
  note?: string;
};
