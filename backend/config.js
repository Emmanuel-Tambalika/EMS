// config.js
import dotenv from "dotenv";
dotenv.config();

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is not defined');
}
