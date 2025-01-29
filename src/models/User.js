import {sequelize} from "../configs/db.js";
import {DataTypes, Op} from "sequelize";
import {Service} from "./Service.js";

export const User = sequelize.define('user', {
    telegramId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
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

class UserClass {
    static async create(data) {
        try {
            const { telegramId, nickName } = data;

            return await User.create({
                telegramId,
                nickName
            });
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    }

    static async updateUser(userId, updateData) {
        try {
            const user = await User.findOne({
                where: {
                    telegramId: String(userId)
                }
            });
            if (user) {
                return await user.update(updateData);
            } else {
                throw new Error('Пользователь не найден');
            }
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            return await User.findAll()
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findById(telegramId) {
        try {
            return await User.findOne({
                where: {
                    telegramId: String(telegramId)
                }
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export {UserClass};
