export type RecommendationEntryInput = {
  date: string;
  weight: number;
  note: string;
  change: number | null;
};

export type RecommendationsResponse = {
  recommendations: string[];
};
