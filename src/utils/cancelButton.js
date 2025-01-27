import toMainMenu from "./toMainMenu.js";
import {deleteAllMessages} from "./clearChat.js";
import {readFile} from "fs/promises";
const texts = JSON.parse(await readFile('./src/locales/uk.json', 'utf-8'));

export default (async (ctx) => {
    const { text } = ctx.message;
    if (text === texts.cancel || text === texts.back) {
        await deleteAllMessages(ctx);

        await toMainMenu(ctx, texts.services_list);
        return !!await ctx.scene.leave();
    } else {
        return true
    }
})
