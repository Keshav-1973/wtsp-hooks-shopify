import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { SHOPIFY_SECRET_KEY = "" } = process.env;

const verifyShopifyHmac = (req: Request, res: Response, next: NextFunction) => {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const body = req.body;

  const hash = crypto
    .createHmac("sha256", SHOPIFY_SECRET_KEY)
    .update(body, "utf8")
    .digest("base64");

  console.log(hmacHeader, "....", hash, "....", SHOPIFY_SECRET_KEY);

  if (hash === hmacHeader) {
    console.log("✅ Verified Shopify Webhook");
  } else {
    console.warn("❌ Could not verify Shopify HMAC");
    res.status(401).send("Unauthorized");
  }

  next();
};

export default verifyShopifyHmac;
