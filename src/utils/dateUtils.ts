import { Timestamp } from "firebase-admin/firestore";

export function formatTimeStamp(firestoreTimestamp: Timestamp) {
  if (!firestoreTimestamp) return "";

  const date = new Date(firestoreTimestamp.seconds * 1000);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long", // Full month name
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
