import { getDoc, setDoc, Timestamp } from "firebase/firestore";
import { requireUserId } from "./auth.service";
import { userDoc } from "./paths";
import { timestampToDate } from "./timestamps";
import type { DailyRecommendation } from "@/types/recommendation";

const COLLECTION_NAME = "dailyRecommendations";

export async function getDailyRecommendation(
  dateKey: string,
): Promise<DailyRecommendation | null> {
  const userId = requireUserId();
  const snapshot = await getDoc(userDoc(userId, COLLECTION_NAME, dateKey));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const recommendations = Array.isArray(data.recommendations)
    ? data.recommendations.filter((item): item is string => typeof item === "string")
    : [];

  return {
    dateKey,
    recommendations,
    createdAt: data.createdAt ? timestampToDate(data.createdAt) : new Date(),
  };
}

export async function saveDailyRecommendation(
  dateKey: string,
  recommendations: string[],
): Promise<DailyRecommendation> {
  const userId = requireUserId();
  const createdAt = new Date();
  await setDoc(userDoc(userId, COLLECTION_NAME, dateKey), {
    dateKey,
    recommendations,
    createdAt: Timestamp.fromDate(createdAt),
  });

  return { dateKey, recommendations, createdAt };
}
