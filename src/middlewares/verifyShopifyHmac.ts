import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { SHOPIFY_SECRET_KEY = "" } = process.env;

const verifyShopifyHmac = (req: Request, res: Response, next: NextFunction) => {
  const hmacHeader = req.headers["X-Shopify-Hmac-Sha256"];
  const body = JSON.stringify(req.body);

  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_SECRET_KEY)
    .update(body)
    .digest("base64");

  if (hmacHeader !== generatedHmac) {
    console.error("Invalid HMAC");
    return res.status(400).send("Invalid HMAC");
  }

  next();
};

export default verifyShopifyHmac;
