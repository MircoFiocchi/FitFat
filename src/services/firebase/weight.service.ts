import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "./config";
import { requireUserId } from "./auth.service";
import type { WeightEntry } from "@/types/weight";

const COLLECTION_NAME = "weightEntries";

function weightEntriesCollection(userId: string) {
  return collection(getFirestoreDb(), "users", userId, COLLECTION_NAME);
}

function timestampToDate(
  value: DocumentData[keyof DocumentData],
): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    return new Timestamp(value.seconds, value.nanoseconds ?? 0).toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  throw new Error("Invalid date value from Firestore");
}

function docToWeightEntry(id: string, data: DocumentData): WeightEntry {
  const note =
    typeof data.note === "string" ? data.note : "";
  return {
    id,
    weight: data.weight as number,
    date: timestampToDate(data.date),
    createdAt: timestampToDate(data.createdAt),
    note,
  };
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  const userId = requireUserId();
  const q = query(
    weightEntriesCollection(userId),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
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
  const data = {
    weight,
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(now),
    note,
  };
  const docRef = await addDoc(weightEntriesCollection(userId), data);
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
  const docRef = doc(
    getFirestoreDb(),
    "users",
    userId,
    COLLECTION_NAME,
    id,
  );
  await updateDoc(docRef, {
    weight,
    date: Timestamp.fromDate(date),
    note,
  });
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const userId = requireUserId();
  const docRef = doc(
    getFirestoreDb(),
    "users",
    userId,
    COLLECTION_NAME,
    id,
  );
  await deleteDoc(docRef);
}
