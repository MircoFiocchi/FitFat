import { collection, doc } from "firebase/firestore";
import { getFirestoreDb } from "./config";

export function userCollection(userId: string, name: string) {
  return collection(getFirestoreDb(), "users", userId, name);
}

export function userDoc(userId: string, name: string, id: string) {
  return doc(getFirestoreDb(), "users", userId, name, id);
}
