import {Markup} from "telegraf";
import {sendMessageAndSave} from "./clearChat.js";
import {startMenuButtons} from "../configs/common.js";


export default (async (ctx, text) => {
    await sendMessageAndSave(ctx, text, Markup.keyboard(startMenuButtons).resize());
})
