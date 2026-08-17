import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

export function subscribeToAuth(
  onUser: (user: User | null) => void,
): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (user) => {
    onUser(user ?? auth.currentUser);
  });
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(
    auth,
    googleProvider,
    browserPopupRedirectResolver,
  );
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

export function requireUserId(): string {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    throw new Error("Tenés que iniciar sesión");
  }
  return uid;
}
