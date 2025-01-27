import { Sequelize } from "sequelize";
import pg from 'pg';
import {SUPABASE_PASSWORD, SUPABASE_URL} from "./configs.js";

const sequelize = new Sequelize(`postgresql://postgres:${SUPABASE_PASSWORD}@db.${SUPABASE_URL}/postgres`, {
    dialectModule: pg,
    schema: 'public',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export { sequelize };
