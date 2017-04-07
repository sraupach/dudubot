//warcraftlogs command
module.exports = function command(bot, container) {
    const util = container.util
    // dependancies------------------------------
    const warcraftlogs = util.usePlugin('warcraftlogs');
    if (!warcraftlogs) {
        return;
    }
    // command-----------------------------------
    return {
        alias: ['l'],
        description: 'Get some warcraftlogs',
        permissions: 'public',
        action: function (meta) {
            //warcraftlogs.getInstance(meta.input, function (result) {
            warcraftlogs.getLastLog(meta.input, function (result) {
                // ZONE should be >> warcraftlogs.getInstance(result[0].zone) <<
                //let line = result[0].title + ' Uploaded by: ' + result[0].owner + ' in ' + result[0].zone
                var Instance = warcraftlogs.getInstance(result[0].zone);
                let embedObj = {
                    type: 'rich',
                    title: 'Warcraftlogs',
                    description: 'Latest <in Harmony> log',
                    color: container.util.toColorInt('01DFD7'),
                    fields: [],
                    thumbnail: {
                        url: 'https://www.warcraftlogs.com/img/common/warcraft-logo.png',
                        proxy_url: '',  // optional
                        height: '25px', // optional
                        width: '25px'   // optional
                    }
                };
                // Add logInfo
                embedObj.fields.push({
                    name: result[0].title,
                    value: '[Direct Log](https://www.warcraftlogs.com/reports/' + result[0].id + ')',
                    inline: true
                });
                // Add LogLocation
                embedObj.fields.push({
                    name: 'Instance',
                    value: ''+Instance+'',
                    inline: true
                });

                bot.sendMessage({
                    to: meta.channelID,
                    message: 'This Module is under construction\n',
                    embed: embedObj
                });
            });

        }
    };
};
