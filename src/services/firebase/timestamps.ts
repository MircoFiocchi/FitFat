import { Timestamp, type DocumentData } from "firebase/firestore";

export function timestampToDate(
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
