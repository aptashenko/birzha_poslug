import { Sequelize } from "sequelize";
import pg from 'pg';
import {SUPABASE_URL} from "./configs.js";

const sequelize = new Sequelize(SUPABASE_URL, {
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
