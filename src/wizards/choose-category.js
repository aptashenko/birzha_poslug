import { Markup, Scenes } from "telegraf";
import cancelButton from "../utils/cancelButton.js";
import {mainMenu, subMenu} from "../configs/common.js";
import {sendMessageAndSave} from "../utils/clearChat.js";

export const chooseCategory = new Scenes.WizardScene(
    "choose-category",
    // Шаг 1
    async (ctx) => {
        await sendMessageAndSave(
            ctx,
            '🔎 Ну що, оберемо категорію?',
            Markup.keyboard(mainMenu).resize()
        );

        ctx.wizard.state.data = {}; // Инициализация состояния
        return ctx.wizard.next();
    },

    // Шаг 2
    async (ctx) => {
        const {text} = ctx.message;

        if (!await cancelButton(ctx)) return

        // Поиск индекса категории
        const parentIdx = mainMenu.findIndex(row => row.includes(text));
        if (parentIdx === -1) {
            await sendMessageAndSave(ctx, '📂 Оберіть категорію зі списку, будь ласка!');
            return ctx.wizard.selectStep(0); // Вернуться на шаг 1
        }

        const childIndex = mainMenu[parentIdx].findIndex(el => el === text);
        ctx.wizard.state.data.category = [parentIdx, childIndex];

        // Проверка наличия подкатегорий
        if (!subMenu[parentIdx] || !subMenu[parentIdx][childIndex]) {
            await sendMessageAndSave(ctx, '📂 Ой, тут підкатегорій ще нема. Спробуй іншу категорію!');
            return
        }

        // Показать подкатегории
        await sendMessageAndSave(
            ctx,
            '📜 Час обрати підкатегорію! Що цікавить?',
            Markup.keyboard(subMenu[parentIdx][childIndex]).resize()
        );
        return ctx.wizard.next();
    },

    // Шаг 3
    async (ctx) => {
        const {text} = ctx.message;
        if (!await cancelButton(ctx)) return

        const { action, data } = ctx.wizard.state;
        const parentIdx = data.category[0];
        const childIdx = data.category[1];

        const subCategoryParentIdx = subMenu[parentIdx][childIdx]
            .findIndex(el => el.includes(text))
        const subCategoryChildIdx = subMenu[parentIdx][childIdx][subCategoryParentIdx]
            .findIndex(el => el === text)

        data.category.push(subCategoryParentIdx, subCategoryChildIdx)

        if (action === 'create') {
            ctx.scene.enter('create-service', {data})
        } else if (action === 'find') {
            ctx.scene.enter('find-service', {data})
        }
    }
);
