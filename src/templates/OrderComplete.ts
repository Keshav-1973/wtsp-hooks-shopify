import dotenv from "dotenv";
import { ShopifyCheckout } from "../types";
import { getFirstName } from "../utils/checkoutUtils.ts";
import { E164Number } from "libphonenumber-js";

dotenv.config();

const { ORDER_CREATE_TEMPLATE, IMAGE_URL } = process.env;

export const orderConfirmationTemplate = (
  checkoutData: ShopifyCheckout,
  phone: E164Number | null
) => {
  const totalAmount = parseFloat(checkoutData.total_price ?? "0");
  const firstName = getFirstName(checkoutData);

  return {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: ORDER_CREATE_TEMPLATE,
      language: { code: "en" },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: IMAGE_URL,
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: firstName },
            { type: "text", text: `${checkoutData.id}` },
            { type: "text", text: `${totalAmount}` },
          ],
        },
      ],
    },
  };
};
