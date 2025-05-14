import dotenv from "dotenv";
import { ShopifyCheckout } from "../types";
import { getFirstName } from "../utils/checkoutUtils.ts";
import { E164Number } from "libphonenumber-js";

dotenv.config();

const { ABANDONED_CHECKOUT_TEMPLATE, IMAGE_URL, DISCOUNT_CODE } = process.env;

export const abandonedCheckoutTemplate = (
  checkoutData: ShopifyCheckout,
  phone: E164Number | null
) => {
  const firstName = getFirstName(checkoutData);

  return {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: ABANDONED_CHECKOUT_TEMPLATE,
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
            { type: "text", text: DISCOUNT_CODE },
          ],
        },
        {
          type: "button",
          sub_type: "COPY_CODE",
          index: 0,
          parameters: [{ type: "coupon_code", coupon_code: DISCOUNT_CODE }],
        },
      ],
    },
  };
};
