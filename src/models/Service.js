import {sequelize} from "../configs/db.js";
import {DataTypes, Op} from "sequelize";

export const Service = sequelize.define('service', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

class ServiceManager {
    /**
     * Создает новую услугу.
     * @param {Object} data - Данные для создания услуги.
     * @param {string} data.userId - ID пользователя.
     * @param {string[]} data.category - Категория услуги.
     * @param {string} data.description - Описание услуги.
     * @param {string} data.phone - Телефон.
     * @param {string} data.username - Имя пользователя.
     * @param {string[]} data.cities - Города.
     * @returns {Promise<Service>} - Созданная услуга.
     */
    static async createOne(data) {
        try {
            const { userId, category, description, phone, username, cities } = data;

            if (!userId || !category || !description || !phone || !username || !cities) {
                throw new Error('Все поля обязательны для заполнения');
            }

            return await Service.create({
                userId,
                category,
                description,
                phone,
                username,
                cities,
            });
        } catch (error) {
            console.error('Ошибка при создании услуги:', error);
            throw error;
        }
    }

    /**
     * Ищет услуги по ID пользователя.
     * @param {string} userId - ID пользователя.
     * @returns {Promise<Service[]>} - Найденные услуги.
     */
    static async getAll(userId) {
        try {
            return await Service.findAll({
                where: {
                    userId,
                },
            });
        } catch (error) {
            console.error('Ошибка при поиске услуг:', error);
            throw error;
        }
    }

    static async filterByCategory(category) {
        try {
            return await Service.findAll({
                where: {
                    category: {
                        [Op.eq]: category
                    }
                }
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async removeOne(id) {
        try {
            return await Service.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
}

export {ServiceManager};
