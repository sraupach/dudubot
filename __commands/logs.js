//warcraftlogs command
module.exports = function command(bot, container) {
    // command-----------------------------------
    return {
        alias: ['l'],
        description: 'Get some warcraftlogs',
        permissions: 'public',
        action: function(meta) {

                bot.sendMessage({
                    to: meta.channelID,
                    message: 'This Module is under construction'
                });

        }
    };
};
