import { Sequelize } from "sequelize";
import {SUPABASE_PASSWORD, SUPABASE_URL} from "./configs.js";

const sequelize = new Sequelize(`postgresql://postgres:${SUPABASE_PASSWORD}@db.${SUPABASE_URL}/postgres`, {
    dialect: 'postgres',
    schema: 'public',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export { sequelize };
