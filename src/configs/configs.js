import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

export const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
export const SERVER_PORT = process.env.PORT;
export const SUPABASE_URL = process.env.SUPABASE_URL;
