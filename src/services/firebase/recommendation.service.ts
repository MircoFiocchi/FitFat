import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "./config";
import { requireUserId } from "./auth.service";
import type { DailyRecommendation } from "@/types/recommendation";

const COLLECTION_NAME = "dailyRecommendations";

function dailyRecommendationDoc(userId: string, dateKey: string) {
  return doc(getFirestoreDb(), "users", userId, COLLECTION_NAME, dateKey);
}

export async function getDailyRecommendation(
  dateKey: string,
): Promise<DailyRecommendation | null> {
  const userId = requireUserId();
  const snapshot = await getDoc(dailyRecommendationDoc(userId, dateKey));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date();
  const recommendations = Array.isArray(data.recommendations)
    ? data.recommendations.filter((item): item is string => typeof item === "string")
    : [];

  return {
    dateKey,
    recommendations,
    createdAt,
  };
}

export async function saveDailyRecommendation(
  dateKey: string,
  recommendations: string[],
): Promise<DailyRecommendation> {
  const userId = requireUserId();
  const createdAt = new Date();
  await setDoc(dailyRecommendationDoc(userId, dateKey), {
    dateKey,
    recommendations,
    createdAt: Timestamp.fromDate(createdAt),
  });

  return {
    dateKey,
    recommendations,
    createdAt,
  };
}
