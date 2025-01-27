import {sequelize} from "../configs/db.js";
import {DataTypes} from "sequelize";

export const User = sequelize.define('user', {
    telegramId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    services: {
        type: DataTypes.JSON,
        defaultValue: []
    }
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
