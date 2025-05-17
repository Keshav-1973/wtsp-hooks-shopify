import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { SHOPIFY_SECRET_KEY = "" } = process.env;

const verifyShopifyHmac = (req: Request, res: Response, next: NextFunction) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  if (!hmac || !SHOPIFY_SECRET_KEY) {
    console.log("❌ Missing HMAC or SECRET_KEY");
    return res.sendStatus(403);
  }

  const computedHmac = crypto
    .createHmac("sha256", SHOPIFY_SECRET_KEY)
    .update(req.body.toString("utf8"))
    .digest("base64");

  if (computedHmac !== hmac) {
    console.log("❌ HMAC verification failed!");
    return res.sendStatus(403);
  }

  next();
};

export default verifyShopifyHmac;
