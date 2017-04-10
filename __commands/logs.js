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
                /*ssss
                var Instance = '-'
                warcraftlogs.getInstance(result[0].zone, function(result) {
                    var Instance = result;

                });
                */

                let embedObj = {
                    type: 'rich',
                    title: 'Warcraftlogs',
                    description: 'Latest <in Harmony> log',
                    color: container.util.toColorInt('0B610B'),
                    fields: [],
                    thumbnail: {
                        url: 'https://www.warcraftlogs.com/img/common/warcraft-logo.png',
                        proxy_url: '',  // optional
                        height: '25px', // optional
                        width: '25px'   // optional
                    }
                };
                // Add logInfo
                // FOR schleife über die länge des Array (result.length)
                for (var i = 0; i < result.length; i++) {
                embedObj.fields.push({
                    name: result[i].title + ' (' + util.epochtime(result[i].start)+')',
                    //name: result[0].title + ' ' + result[0].start,
                    value: '[link to log](https://www.warcraftlogs.com/reports/' + result[i].id + ')',
                    inline: false
                });
                }
                // ENDE FOR schleife
                /* 
                //Add LogLocation
                embedObj.fields.push({
                    name: result[1].title + ' (' + util.epochtime(result[1].start)+')',
                    value: '[link to log](https://www.warcraftlogs.com/reports/' + result[1].id + ')',
                    inline: false
                });
                // Add LogLocation
                embedObj.fields.push({
                    name: result[2].title + ' (' + util.epochtime(result[2].start)+')',
                    value: '[link to log](https://www.warcraftlogs.com/reports/' + result[2].id + ')',
                    inline: false
                });
                */
                bot.sendMessage({
                    to: meta.channelID,
                    message: 'This Module is under construction\n',
                    embed: embedObj
                });
            });

        }
    };
};
