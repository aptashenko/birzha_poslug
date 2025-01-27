import {Scenes} from "telegraf";
import {ServiceManager} from "../models/Service.js";
import serviceMessageFormatter from "../utils/serviceMessageFormatter.js";
import {sendMarkdownMessageAndSave, sendMessageAndSave} from "../utils/clearChat.js";
import cancelButton from "../utils/cancelButton.js";

export const findService = new Scenes.WizardScene(
    'find-service',
    async (ctx) => {
        if (!await cancelButton(ctx)) return

        const servicesList = await ServiceManager.filterByCategory(ctx.wizard.state.data.category);

        if (!servicesList?.length) {
            return await sendMessageAndSave(ctx, '✨ Тут поки нічого немає, але ти можеш стати першим, хто додасть щось цікавеньке!')
        }
        for (const service of servicesList) {
            await sendMarkdownMessageAndSave(ctx, serviceMessageFormatter(service));
        }

        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!await cancelButton(ctx)) return
    }
)
