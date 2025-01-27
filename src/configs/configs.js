import fs from "node:fs";
import dotenv from "dotenv";

const mode = 'dev';

const environment = {
    prod: '.env.production',
    dev: '.env.development'
}

if (fs.existsSync(environment[mode])) dotenv.config({ path: environment[mode] });


if (fs.existsSync('.env.local')) dotenv.config();


export const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
export const SERVER_PORT = process.env.PORT;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;
