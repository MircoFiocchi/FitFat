import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "./config";

const BATCH_LIMIT = 400;

export type LegacyMigrationResult = {
  skipped: boolean;
  weightCount: number;
  recommendationCount: number;
};

async function copyCollection(
  sourcePath: string,
  targetCollection: ReturnType<typeof collection>,
): Promise<number> {
  const db = getFirestoreDb();
  const snapshot = await getDocs(collection(db, sourcePath));
  if (snapshot.empty) return 0;

  const docs = snapshot.docs;
  for (let index = 0; index < docs.length; index += BATCH_LIMIT) {
    const batch = writeBatch(db);
    const chunk = docs.slice(index, index + BATCH_LIMIT);
    for (const sourceDoc of chunk) {
      batch.set(doc(targetCollection, sourceDoc.id), sourceDoc.data());
    }
    await batch.commit();
  }

  return docs.length;
}

export async function migrateLegacyDataIfNeeded(
  userId: string,
): Promise<LegacyMigrationResult> {
  const db = getFirestoreDb();
  const profileRef = doc(db, "users", userId);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists() && profileSnap.data().legacyMigrated === true) {
    return { skipped: true, weightCount: 0, recommendationCount: 0 };
  }

  const weightCount = await copyCollection(
    "weightEntries",
    collection(db, "users", userId, "weightEntries"),
  );
  const recommendationCount = await copyCollection(
    "dailyRecommendations",
    collection(db, "users", userId, "dailyRecommendations"),
  );

  await setDoc(
    profileRef,
    {
      legacyMigrated: true,
      legacyMigratedAt: Timestamp.now(),
    },
    { merge: true },
  );

  return {
    skipped: false,
    weightCount,
    recommendationCount,
  };
}
