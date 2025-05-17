import { E164Number } from "libphonenumber-js";
import { fireStoreAdmin, fireStoreDb } from "../config/firebase";
import {
  ShopifyCheckout,
  WhatsAppApiError,
  WhatsAppCallbackError,
  WhatsAppMessageResponse,
} from "../types";
import { getFullName } from "../utils/checkoutUtils.ts";
import { formatTimeStamp } from "../utils/dateUtils";
import { WTSP_COLLECTION } from "../constants/Constants";

export async function logMessageStatusToDb({
  checkoutData,
  phone = null,
  hookType,
  wtspResponse,
  wtspError,
}: {
  checkoutData: ShopifyCheckout;
  phone: E164Number | null;
  hookType: string;
  wtspResponse: WhatsAppMessageResponse | null;
  wtspError: WhatsAppApiError | null;
}): Promise<void> {
  const timestamp = fireStoreAdmin.firestore.Timestamp.now();
  const formattedDateTime = formatTimeStamp(timestamp);
  const fullName = getFullName(checkoutData);
  const { messages = [{ message_status: "unknown", id: "" }] } =
    wtspResponse || {};

  const { id = "", completed_at = "" } = checkoutData;

  await fireStoreDb.collection(WTSP_COLLECTION).add({
    fullName: fullName ?? "",
    phone: phone ?? "",
    checkoutId: id ?? "",
    messageId: messages?.[0]?.id ?? "",
    checkout_completed_at: completed_at ?? "",
    timeStamp: timestamp ?? "",
    formattedTimStamp: formattedDateTime ?? "",
    wtspResponse: wtspResponse ?? null,
    wtspError: wtspError ?? null,
    hookType: hookType ?? "",
  });
}

export async function updateDbCollection({
  docRef,
  hookResponse,
}: {
  docRef: FirebaseFirestore.DocumentReference;
  hookResponse: WhatsAppCallbackError | null;
}): Promise<void> {
  const timestamp = fireStoreAdmin.firestore.Timestamp.now();
  const formattedDateTime = formatTimeStamp(timestamp);

  await docRef.update({
    formattedTimStamp: formattedDateTime ?? "",
    hookResponse: hookResponse ?? null,
  });
}
