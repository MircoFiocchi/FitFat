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
import type { WeightEntry } from "@/types/weight";

const COLLECTION_NAME = "weightEntries";

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
  return {
    id,
    weight: data.weight as number,
    date: timestampToDate(data.date),
    createdAt: timestampToDate(data.createdAt),
  };
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, COLLECTION_NAME),
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
): Promise<WeightEntry> {
  const db = getFirestoreDb();
  const now = new Date();
  const data = {
    weight,
    date: Timestamp.fromDate(date),
    createdAt: Timestamp.fromDate(now),
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
  return {
    id: docRef.id,
    weight,
    date,
    createdAt: now,
  };
}

export async function updateWeightEntry(
  id: string,
  weight: number,
  date: Date,
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    weight,
    date: Timestamp.fromDate(date),
  });
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
