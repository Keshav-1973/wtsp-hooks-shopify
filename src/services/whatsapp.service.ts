import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { WhatsAppMessageResponse } from "../types";

dotenv.config();

const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

export const sendWhatsAppMessage = (
  messageData: Object
): Promise<AxiosResponse<WhatsAppMessageResponse>> => {
  return axios.post<WhatsAppMessageResponse>(
    `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    messageData,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};
