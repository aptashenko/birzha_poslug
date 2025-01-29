import {Markup} from "telegraf";
import {sendMessageAndSave} from "./clearChat.js";
import {startMenuButtons} from "../configs/common.js";


export default (async (ctx, text) => {
    const buttons = await startMenuButtons(ctx.message.from.id.toString());

    await sendMessageAndSave(ctx, text, Markup.keyboard(buttons).resize());
})
