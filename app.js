import express from 'express';
import {Markup, Telegraf, session, Scenes} from 'telegraf';
import { TELEGRAM_BOT_TOKEN } from "./src/configs/configs.js";
import {sequelize} from "./src/configs/db.js";
import {chooseCategory} from "./src/wizards/choose-category.js";
import {createService} from "./src/wizards/create-service.js";
import {findService} from "./src/wizards/find-service.js";
import {managerComposer, manageServices} from "./src/wizards/manage-services.js";
import {sendMarkdownMessageAndSave} from "./src/utils/clearChat.js";
import {startMenuButtons, startMenuButtonsAdmin} from "./src/configs/common.js";
import textLoader from "./src/utils/getTexts.js";
import {UserClass} from "./src/models/User.js";

const app = express();
app.use(express.json());
const port = 3000
app.listen(port, "0.0.0.0",async () => {
    await textLoader.loadTexts();
    console.log(`Express server is running on http://localhost:${port}`);
});


(async () => {
    await sequelize.sync();
    console.log('База данных синхронизирована');
})();

const currentScenes = [chooseCategory, createService, findService, manageServices];

export const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const stage = new Scenes.Stage(currentScenes);
export const botMessages = new Map();

if (process.env.NODE_ENV !== "development") {
    bot.telegram.setWebhook('https://birzha-poslug.fly.dev/webhook');
    app.use(bot.webhookCallback('/webhook'));
}

bot.use(session())
    .use(stage.middleware())
    .use(managerComposer)

if (process.env.NODE_ENV === "development") {
    bot.launch()
}

bot.start(async (ctx) => {
    const { id, username } = ctx.message.from;
    const isExist = await UserClass.findById(id);

    if (!isExist) {
        const telegramId = id;
        await UserClass.create({telegramId, username: undefined});
    }
    const buttons = await startMenuButtons(id.toString());

    await sendMarkdownMessageAndSave(
        ctx,
        `👋 Вітаємо у Біржі Послуг – зручній біржі послуг у Франції\\! 🤝\n\nТут ви можете:\n🔹 Знайти спеціаліста для будь\\-яких завдань\\.\n🔹 Запропонувати свої послуги та отримати клієнтів\\.\n🔹 Публікувати оголошення з детальним описом\\.`,
        Markup.keyboard(buttons).resize());
    await sendMarkdownMessageAndSave(
        ctx,
        `✨ Щоб розпочати:\n\n1️⃣ Оберіть у меню, що вас цікавить: знайти послугу або запропонувати послугу\\.\n2️⃣ Заповніть необхідну інформацію\\.\n3️⃣ Чекайте відповіді або знаходьте оголошення інших користувачів\\!\n\n🚀 Біржа Послуг – знайомтесь, співпрацюйте, досягайте разом\\!`
    )
});

bot.hears(startMenuButtonsAdmin[0][0], (ctx) => {
    ctx.scene.enter('choose-category', {action: 'create'})
});

bot.hears(startMenuButtonsAdmin[0][1], (ctx) => {
    ctx.scene.enter('choose-category', {action: 'find'})
});

bot.hears(startMenuButtonsAdmin[1], (ctx) => {
    ctx.scene.enter('manage-services')
});

bot.hears(startMenuButtonsAdmin[2],  async(ctx) => {
    const allUsers = await UserClass.getAll();
    ctx.reply(`Всього користувачів: ${allUsers.length}`);
});

bot.on('message', async (ctx) => {
    if (ctx.message.from.id === ctx.botInfo.id) { // Проверяем, что сообщение отправлено ботом
        const chatId = ctx.chat.id;
        const messageId = ctx.message.message_id;

        // Сохраняем message_id в Map
        if (!botMessages.has(chatId)) {
            botMessages.set(chatId, []);
        }
        botMessages.get(chatId).push(messageId);
    }
});

export default app;
