module.exports = function command(bot, container) {
    const util = container.util

    // dependancies------------------------------
    const voiceAnnounce = util.usePlugin('voiceAnnounce');
    if (!voiceAnnounce) {
        return;
    }

    // command-----------------------------------
    return {
        alias: ['vc'],
        description: 'get current user from voice channel',
        permissions: 'private',
        action: function (meta) {
            //console.log("run command !vc")
            //call vcmatchdb - matching Voice-Channel with DB
            voiceAnnounce.vcmatchdb(meta.server);
            //
            voiceAnnounce.vcstats(meta.server, function (vcstat) {

                let embedObj = {
                    type: 'rich',
                    title: 'Voice Information: ' + vcstat.server,
                    description: '',
                    color: container.util.toColorInt('01DFD7'),
                    fields: [],
                    thumbnail: {
                        url: 'https://static1.squarespace.com/static/53fce470e4b0374adfdd30bc/t/55f85491e4b098ca1dd8e4c9/1442337939945/feature-buttons-voice-control.png',
                        proxy_url: '',  // optional
                        height: '25px', // optional
                        width: '25px'   // optional
                    }
                };
                // Add Voice user-count
                embedObj.fields.push({
                    name: `Active User in ` + vcstat.voiceChannel + `: `,
                    value: vcstat.count,
                    inline: false
                });
                // Add User list
                embedObj.fields.push({
                    name: `Users: `,
                    value: '' + vcstat.user + '',
                    inline: false
                });

                bot.sendMessage({
                    to: meta.channelID,
                    message: '',
                    embed: embedObj
                });
            });
        }
    };
};