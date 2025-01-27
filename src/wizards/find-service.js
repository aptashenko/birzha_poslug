import {Scenes} from "telegraf";
import {ServiceManager} from "../models/Service.js";
import serviceMessageFormatter from "../utils/serviceMessageFormatter.js";
import {sendMarkdownMessageAndSave, sendMessageAndSave} from "../utils/clearChat.js";
import cancelButton from "../utils/cancelButton.js";
import toMainMenu from "../utils/toMainMenu.js";
import {Categories} from "../utils/categories.js";

export const findService = new Scenes.WizardScene(
    'find-service',
    async (ctx) => {
        if (!await cancelButton(ctx)) return

        const categoryArray = await Categories.getIndicesByText(ctx.message.text);
        const servicesList = await ServiceManager.filterByCategory(categoryArray);

        if (!servicesList?.length) {
            return await sendMessageAndSave(ctx, '✨ Тут поки нічого немає, але ти можеш стати першим, хто додасть щось цікавеньке!');
        } else {
            await toMainMenu(ctx, `Ось що є у категорії ${ctx.message.text}`)
            for (const service of servicesList) {
                await sendMarkdownMessageAndSave(ctx, serviceMessageFormatter(service));
            }
            return ctx.scene.leave()
        }


        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!await cancelButton(ctx)) return
    }
)
