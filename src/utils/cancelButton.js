import toMainMenu from "./toMainMenu.js";
import {deleteAllMessages} from "./clearChat.js";
import textLoader from "./getTexts.js";

export default (async (ctx) => {
    const { text } = ctx.message;
    const {texts} = textLoader;
    if (text === texts.cancel || text === texts.back) {
        await deleteAllMessages(ctx);

        await toMainMenu(ctx, texts.services_list);
        return !!await ctx.scene.leave();
    } else {
        return true
    }
})
