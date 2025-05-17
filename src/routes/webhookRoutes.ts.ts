// routes/webhookRoutes.ts
import express from "express";
import verifyShopifyHmac from "../middlewares/verifyShopifyHmac";
import {
  handleCheckoutEvent,
  handleOrderEvent,
  handleWebhookVerification,
} from "../controllers/webhook.controller";
import { ROUTE_NAMES } from "../constants/Constants";

const router = express.Router();

router.post(
  ROUTE_NAMES.CHECKOUT_UPDATE,
  verifyShopifyHmac,
  handleCheckoutEvent
);
router.post(ROUTE_NAMES.ORDER_CREATE, verifyShopifyHmac, handleOrderEvent);
router.get(ROUTE_NAMES.WTSP_HOOK_CALLBACK, handleWebhookVerification);

export default router;
