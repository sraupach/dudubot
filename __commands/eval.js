module.exports = function command(bot, container) {
    // command-----------------------------------
    return {
        alias: ['e'],
        description: 'Evaluate JS, print errors',
        permissions: 'public',
        action: function(meta) {
            let output = false;
            try {
                /* jslint evil: true */
                eval(meta.input);
            } catch(err) {
                output = err;
            }

            if (output) {
                bot.sendMessage({
                    to: meta.channelID,
                    message: `\`\`\`js\n${output}\n\`\`\``
                });
            }
        }
    };
};
