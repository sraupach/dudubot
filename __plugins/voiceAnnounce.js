/*
    Voice Announce

    Author:  Krasserdudu
    Twitter: @gexooo

    Description:
        Announce Voice-Channel join and leave
        on command it will list the current Voice Channel Users(+count)
*/

module.exports = function plugin(bot, container, pconfig) {

    // reference---------------------------------
    const config = container.config;
    const util = container.util
    const db = container.db;
    // dependencies 
    var LinkedList = require('singly-linked-list');
    var list = new LinkedList();

    list.clear();
    // plugin------------------------------------
    bot.on('any', function (event) {
        if (event.t == "VOICE_STATE_UPDATE") {
            if (event.d) {
                var usernick = bot.users[event.d.user_id].username;
                var userid = event.d.user_id
                var serverID = event.d.guild_id
                var serverName = bot.servers[serverID].name

                // OOOO hier musst du jetzt die ServerID raussuchen und dann in eine Var/Const schreiben, diese dann unten einfügen
                // bot.servers[serverID].channels[pconfig.Server[serverID].vcID].members) in members sind die Discord-IDs

                if (serverID in pconfig.Server) {
                    if (event.d.channel_id == pconfig.Server[serverID].vcID) {

                        if (list.contains(userid)) {
                            util.vlog(usernick + " in der Liste gefunden - (activ in Raid voice Channel)", serverName)
                        } else {
                            list.insert(userid)
                            var vcName = bot.servers[serverID].channels[event.d.channel_id].name
                            util.vlog(usernick + " added to List - Joined " + vcName + " Channel", serverName)

                            bot.sendMessage({
                                to: pconfig.Server[serverID].reportToChannel,
                                message: util.timestamp() + usernick + " joined"
                            });
                        };

                    } else {

                        if (list.contains(userid)) {
                            list.removeNode(userid)
                            util.vlog(usernick + " removed from List - Left Channel", serverName);

                            bot.sendMessage({
                                to: pconfig.Server[serverID].reportToChannel,
                                message: util.timestamp() + usernick + " left"
                            });
                        } else {
                            //console.log("User exisitert nicht in der Liste")
                        };

                    };
                };
            };
        } else {

        };
    });



    // methods-----------------------------------
    // Check if DB-Entity exists and update entry with currently active User in #Voice-Channel

    plugin.vcmatchdb = function (server) {
        let ServerID = server;
        let vcID = pconfig.Server[ServerID].vcID;
        let userlist = []
        Object.keys(bot.servers[ServerID].channels[vcID].members).forEach(function (id) {
            userlist.push(id);
        });

        db.client.findOne({ type: 'vc-users', serverID: ServerID }, function (err, vcUsers) {

            if (vcUsers) {
                util.vlog('vc-users found in DB...only need to update!');
                // DB-Entry exists: db.update list (voice channel --> DB)
                db.client.update({
                    type: 'vc-users',
                }, {
                        $set: {
                            user: userlist,
                            last_update: Date.now()
                        }
                    });
            } else {
                // create the vs-users entry and save it
                util.vlog('NO vc-users found in DB...creating it!');
                vcUsers = {
                    type: 'vc-users',
                    serverID: ServerID,
                    chanID: vcID,
                    user: userlist,
                    last_update: Date.now()
                };
                // insert the stats
                db.client.insert(vcUsers, function (err, vcUsers) {
                    util.vlog('DB-Insert von vc-users wurde durchgeführt')
                    //
                });
            }
        });
    }


    plugin.vcstats = function (server) {
        const vcstat = {
            count: 5,
            user: ""
        };
        db.client.count({ type: "vc-users" }, function (err, count) {
            vcstat.count = count;
        });
        util.vlog(" --> " + vcstat.count)
        return vcstat;
    }
    /**
     * returns the current UserCount & all Users in Voice Channel
     */
    plugin.getVClist = function () {
        //hier muss die listenausgabe rein
        var voicelist = []
        var voicecount = list.getSize()
        if (voicecount > 0) {
            for (var i = 0; i < voicecount; i++) {
                vUID = list.findAt(i);
                user = bot.users[vUID].username;
                voicelist.push(user);
            }
        } else {
            voicelist = "No user found";

        }
        return [voicecount, voicelist];
    };

    //return true;
    return plugin;
};
