module.exports = function command(bot, container) {
    const util = container.util
    // command-----------------------------------
    return {
        alias: ['ac'],
        description: 'set the current activity of the bot',
        permissions: 'private',
        action: function (meta) {
            bot.setPresence({
                game: {
                    "name": meta.input
                }
            });
        }
    };
};