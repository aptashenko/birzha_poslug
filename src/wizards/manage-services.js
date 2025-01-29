import {Composer, Markup, Scenes} from "telegraf";
import serviceMessageFormatter from "../utils/serviceMessageFormatter.js";
import {ServiceManager} from "../models/Service.js";
import cancelButton from "../utils/cancelButton.js";
import {sendMarkdownMessageAndSave, sendMessageAndSave} from "../utils/clearChat.js";
import textLoader from "../utils/getTexts.js";
import {UserClass} from "../models/User.js";

export const managerComposer = new Composer();

managerComposer.action(/^delete_(\d+)$/, async (ctx) => {
    try {
        const serviceId = ctx.match[1];
        const {texts} = textLoader;

        await ServiceManager.removeOne(serviceId);
        const id = ctx.update.callback_query.from.id;
        const servicesList = await ServiceManager.getAll(id.toString());

        await UserClass.updateUser(id.toString(), {services: servicesList})
        ctx.deleteMessage()

        await sendMessageAndSave(ctx, texts.services_deleted)

    } catch (error) {
        console.error('Якась помилка:', error);
    }
});

managerComposer.hears('\uD83D\uDD19 Назад', async (ctx) => {
    if (!await cancelButton(ctx)) return
    return ctx.scene.leave();
})


export const manageServices = new Scenes.WizardScene(
    'manage-services',
    async (ctx) => {
        try {
            const servicesList = await ServiceManager.getAll(ctx.message.from.id);
            const {texts} = textLoader;

            // Если услуг нет, сообщаем об этом
            if (servicesList.length === 0) {
                await sendMessageAndSave(ctx, texts.services_empty);
                return ctx.scene.leave();
            }

            await sendMessageAndSave(ctx, texts.services_title, Markup.keyboard([
                [texts.back]
            ]).resize())

            for (const service of servicesList) {
                await sendMarkdownMessageAndSave(
                    ctx,
                    serviceMessageFormatter(service), // Форматируем сообщение
                    Markup.inlineKeyboard([
                        Markup.button.callback(texts.remove, `delete_${service.id}`) // Кнопка с callback-данными
                    ])
                );
            }
            // Завершаем сцену после отправки всех сообщений
            return ctx.scene.leave();
        } catch (error) {
            console.error('Ошибка при управлении услугами:', error);
            await sendMessageAndSave(ctx,'Якась помилка ❌');
            return ctx.scene.leave();
        }
    }
)
