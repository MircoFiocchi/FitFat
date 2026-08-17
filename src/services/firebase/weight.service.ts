import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { requireUserId } from "./auth.service";
import { userCollection, userDoc } from "./paths";
import { timestampToDate } from "./timestamps";
import type { WeightEntry } from "@/types/weight";

const COLLECTION_NAME = "weightEntries";

function docToWeightEntry(id: string, data: DocumentData): WeightEntry {
  return {
    id,
    weight: data.weight as number,
    date: timestampToDate(data.date),
    createdAt: timestampToDate(data.createdAt),
    note: typeof data.note === "string" ? data.note : "",
  };
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  const userId = requireUserId();
  const snapshot = await getDocs(
    query(userCollection(userId, COLLECTION_NAME), orderBy("date", "desc")),
  );
  return snapshot.docs.map((docSnap) =>
    docToWeightEntry(docSnap.id, docSnap.data()),
  );
}

export async function createWeightEntry(
  weight: number,
  date: Date,
  note = "",
): Promise<WeightEntry> {
  const userId = requireUserId();
  const now = new Date();
  const docRef = await addDoc(userCollection(userId, COLLECTION_NAME), {
    weight,
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(now),
    note,
  });
  return {
    id: docRef.id,
    weight,
    date,
    createdAt: now,
    note,
  };
}

export async function updateWeightEntry(
  id: string,
  weight: number,
  date: Date,
  note = "",
): Promise<void> {
  const userId = requireUserId();
  await updateDoc(userDoc(userId, COLLECTION_NAME, id), {
    weight,
    date: Timestamp.fromDate(date),
    note,
  });
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const userId = requireUserId();
  await deleteDoc(userDoc(userId, COLLECTION_NAME, id));
}
