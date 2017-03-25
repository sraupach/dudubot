module.exports = function command(bot, container) {
    const util = container.util
    // command-----------------------------------
    return {
        alias: ['ac'],
        description: 'set the current activity of the bot',
        permissions: 'private',
        action: function (meta) {
            client.setPresence({
                game: {
                    "name": meta.input
                }
            }, function (meta) {
                bot.sendMessage({
                    to: meta.channelID,
                    message: '\`set playing to: **' + meta.input +'**\`'
                });
            });

        }
    };
};