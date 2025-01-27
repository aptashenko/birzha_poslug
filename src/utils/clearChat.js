// Храним message_id сообщений бота
const botMessages = new Map();

// Отправка сообщения и сохранение message_id
const sendMessageAndSave = async (ctx, text, options = {}) => {
    const message = await ctx.reply(text, options);
    const chatId = ctx.chat.id;
    const messageId = message.message_id;

    // Сохраняем message_id
    if (!botMessages.has(chatId)) {
        botMessages.set(chatId, []);
    }
    botMessages.get(chatId).push(messageId);

    return message;
};

const sendMarkdownMessageAndSave = async (ctx, text, options = {}) => {
    const message = await ctx.replyWithMarkdownV2(text, options);
    const chatId = ctx.chat.id;
    const messageId = message.message_id;

    // Сохраняем message_id
    if (!botMessages.has(chatId)) {
        botMessages.set(chatId, []);
    }
    botMessages.get(chatId).push(messageId);

    return message;
};

const deleteAllMessages = async (ctx) => {
    const chatId = ctx.chat.id;

    const messageIds = botMessages.get(chatId);
    if (!messageIds?.length) return

    for (const messageId of messageIds) {
        try {
            await ctx.deleteMessage(messageId);
        } catch (error) {
            console.error(`Ошибка при удалении сообщения ${messageId}:`, error);
        }
    }

    botMessages.set(chatId, []);
}

export {
    sendMessageAndSave,
    deleteAllMessages,
    sendMarkdownMessageAndSave
}
