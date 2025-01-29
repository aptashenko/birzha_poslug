import {Markup, Scenes} from "telegraf";
import serviceMessageFormatter from "../utils/serviceMessageFormatter.js";
import {ServiceManager} from "../models/Service.js";
import toMainMenu from "../utils/toMainMenu.js";
import cancelButton from "../utils/cancelButton.js";
import {sendMarkdownMessageAndSave, sendMessageAndSave} from "../utils/clearChat.js";
import textLoader from "../utils/getTexts.js";
import {UserClass} from "../models/User.js";

const timeoutStart = (minutes, ctx) => {
    ctx.reply('start timer')
    return setTimeout(() => {
        ctx.scene.leave(); // Выход из сцены
        toMainMenu(ctx, 'Десь ви пропали 😔')
    }, 5 * 60 * 1000)
}

export const createService = new Scenes.WizardScene(
    'create-service',
    async (ctx) => {
        const {texts} = textLoader;

        await sendMarkdownMessageAndSave(
            ctx,
            texts.create_description,
            Markup.keyboard([
            [texts.cancel]
        ]).resize());
        ctx.scene.state.timeout = timeoutStart(1, ctx);
        return ctx.wizard.next();
    },
    async (ctx) => {
        const {text} = ctx.message;
        if (!await cancelButton(ctx)) return

        ctx.wizard.state.data.description = text;
        const {texts} = textLoader;

        await sendMarkdownMessageAndSave(
            ctx,
            texts.create_cities,
            Markup.keyboard([
            [texts.cancel]
        ]).resize());
        return ctx.wizard.next();
    },

    // Шаг 4: Ввод контактных данных
    async (ctx) => {
        const {text} = ctx.message;
        if (!await cancelButton(ctx)) return
        const {texts} = textLoader;

        ctx.wizard.state.data.cities = text.trim().split(',');

        await sendMarkdownMessageAndSave(
            ctx,
            texts.create_phone,
            Markup.keyboard([
            [texts.cancel]
        ]).resize());
        return ctx.wizard.next();
    },

    // Шаг 4: Ввод контактных данных
    async (ctx) => {
        const { text } = ctx.message;
        if (!await cancelButton(ctx)) return
        const {texts} = textLoader;

        ctx.wizard.state.data.phone = text;

        await sendMarkdownMessageAndSave(
            ctx,
            texts.create_nickname,
            Markup.keyboard([
            [texts.cancel]
        ]).resize());
        return ctx.wizard.next();
    },

    // Шаг 5: Подтверждение данных
    async (ctx) => {
        const {text} = ctx.message;
        if (!await cancelButton(ctx)) return
        const {texts} = textLoader;

        const { data } = ctx.wizard.state;
        data.username = text.replace('@', '');

        await sendMarkdownMessageAndSave(ctx, serviceMessageFormatter(data),
            Markup.keyboard([
                [texts.cancel, texts.accept]
            ]).resize()
        );
        return ctx.wizard.next();
    },

    // Шаг 6: Обработка подтверждения или отмены
    async (ctx) => {
        const { text, from: {id} } = ctx.message;
        if (!await cancelButton(ctx)) return
        const {texts} = textLoader;

        if (text === texts.accept) {
            const {
                category,
                description,
                cities,
                phone,
                username
            } = ctx.wizard.state.data;

            try {
                await toMainMenu(ctx, texts.create_success)

                await ServiceManager.createOne({
                    userId: id.toString(),
                    category,
                    description,
                    cities,
                    phone,
                    username
                })
                const servicesList = await ServiceManager.getAll(id.toString());

                await UserClass.updateUser(id.toString(), {services: servicesList})
            } catch (error) {
                console.error(error)
            }
        } else if (text === texts.cancel) {
            await toMainMenu(ctx, texts.create_fail)
        } else {
            await sendMessageAndSave(ctx, texts.create_choose);
            return; // Оставляем пользователя на этом шаге
        }

        clearTimeout(ctx.scene.state.timeout)
        return ctx.scene.leave();
    }
)
