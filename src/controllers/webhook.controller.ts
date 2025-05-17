import { Request, Response } from "express";
import { ShopifyCheckout } from "../types";
import { sendWhatsAppMessage } from "../services/whatsapp.service";
import { orderConfirmationTemplate } from "../templates/OrderComplete";
import {
  logMessageStatusToDb,
  updateDbCollection,
} from "../services/logger.service";
import { getRawPhone } from "../utils/checkoutUtils.ts";
import {
  isValidIndianPhoneNumber,
  parseIndianPhoneNumber,
} from "../utils/phoneUtils.ts";
import { ROUTE_NAMES, WTSP_COLLECTION } from "../constants/Constants";
import { fireStoreDb } from "../config/firebase";
import { abandonedCheckoutTemplate } from "../templates/AbandonedCheckout";
import dotenv from "dotenv";

dotenv.config();

const { VERIFY_TOKEN } = process.env;

export const handleCheckoutEvent = async (req: Request, res: Response) => {
  console.log("handleCheckoutEvent triggered");
  const checkoutData: ShopifyCheckout = req.body;

  if (checkoutData.completed_at) {
    console.log("Checkout already completed, no WhatsApp sent.");
    return res
      .status(200)
      .send("Checkout already completed, no WhatsApp sent.");
  }

  const rawPhone = getRawPhone(checkoutData);
  const phone = parseIndianPhoneNumber(rawPhone);

  if (!isValidIndianPhoneNumber(rawPhone)) {
    console.error(`Invalid Phone Number${rawPhone}`);
    return res.status(200).send(`Invalid Phone Number${rawPhone}`);
  }

  const existing = await fireStoreDb
    .collection(WTSP_COLLECTION)
    .where("checkoutId", "==", checkoutData?.id)
    .get();

  if (!existing.empty) {
    console.log(`🔁 Already processed checkoutId ${checkoutData?.id}`);
    return res
      .status(200)
      .send(`Already processed checkoutId ${checkoutData?.id}`);
  }

  const recentMessages = await fireStoreDb
    .collection(WTSP_COLLECTION)
    .where("phone", "==", phone)
    .orderBy("checkoutId", "desc")
    .limit(1)
    .get();

  const now = new Date() as any;
  const lastSentTime = recentMessages?.docs?.[0]?.data()?.timeStamp?.toDate();

  if (lastSentTime && now - lastSentTime.getTime() < 24 * 60 * 60 * 1000) {
    console.log("WhatsApp already sent in last 24h");
    return res.status(200).send(`WhatsApp already sent in last 24h`);
  }

  try {
    const messageData = abandonedCheckoutTemplate(checkoutData, phone);
    const response = await sendWhatsAppMessage(messageData);

    console.log("ibjjj 111", response.data);

    await logMessageStatusToDb({
      checkoutData,
      phone,
      wtspResponse: response.data,
      wtspError: null,
      hookType: ROUTE_NAMES.CHECKOUT_UPDATE,
    });
  } catch (error: any) {
    await logMessageStatusToDb({
      checkoutData,
      phone,
      wtspError: error.response?.data?.error,
      wtspResponse: null,
      hookType: ROUTE_NAMES.CHECKOUT_UPDATE,
    });
  }

  return res.status(200).send("Checkout event processed");
};

export const handleOrderEvent = async (req: Request, res: Response) => {
  console.log("handleOrderEvent triggered");

  const checkoutData: ShopifyCheckout = req.body;
  const rawPhone = getRawPhone(checkoutData);
  const phone = parseIndianPhoneNumber(rawPhone);
  if (isValidIndianPhoneNumber(rawPhone)) {
    try {
      const messageData = orderConfirmationTemplate(checkoutData, phone);
      const response = await sendWhatsAppMessage(messageData);
      await logMessageStatusToDb({
        checkoutData,
        phone,
        wtspResponse: response.data,
        wtspError: null,
        hookType: ROUTE_NAMES.ORDER_CREATE,
      });
    } catch (error: any) {
      await logMessageStatusToDb({
        checkoutData,
        phone,
        wtspError: error.response.data?.error,
        wtspResponse: null,
        hookType: ROUTE_NAMES.ORDER_CREATE,
      });
    }
  } else {
    console.error(`Invalid Phone Number${rawPhone}`);
  }

  res.status(200).send("Order event processed");
};

export const handleWebhookVerification = async (
  req: Request,
  res: Response
) => {
  console.log("handleWebhookVerification triggered");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge as string);
  } else {
    res.sendStatus(403);
  }
};

export const handleMetaCallback = async (req: Request, res: Response) => {
  console.log("handleMetaCallback triggered");

  const body = req.body;

  if (!body?.entry || !Array.isArray(body.entry) || body.entry.length === 0) {
    return res.sendStatus(404);
  }

  const response = body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0] ?? null;

  const messageId = response?.id ?? "";

  try {
    const messageDoc = await fireStoreDb
      .collection(WTSP_COLLECTION)
      .where("messageId", "==", messageId)
      .get();

    if (messageDoc.empty) {
      console.log(`No existing document found for messageId:${messageId}`);
      return res.sendStatus(200);
    }
    const docSnapshot = messageDoc.docs[0];
    const docRef = docSnapshot.ref;

    await updateDbCollection({
      docRef: docRef,
      hookResponse: response,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return res.sendStatus(500);
  }
};
