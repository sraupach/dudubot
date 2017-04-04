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

    // events------------------------------------
    // on DB-Ready check for entry in DB if not create it.
    bot.on('dbready', function () {
        db.client.findOne({ type: 'vc-users' }, function (err, result) {
            if (result) {
                // DB exists
            } else {
                // we need to create the global stats
                vcUsers = {
                    type: 'vc-users'
                };
                // insert/create the stats
                db.client.insert(vcUsers, function (err, vcUsers) {
                    util.vlog('[DB] created insert for \'vc-users\'')
                });
            }


        });
    });

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
                        // update DB-entry on event
                        plugin.vcmatchdb(serverID);

                        //
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
            userlist.push(bot.users[id].username)
        });
        let count = userlist.length
        // DB-Entry exists: db.update list (voice channel --> DB) ....
        db.client.update({ type: 'vc-users' }, {$set: { user: userlist, count: count, server: bot.servers[ServerID].name, voiceChannel: bot.servers[ServerID].channels[vcID].name }}, {}, function() {

        });
    }

    // new module for counting the users in channel
    plugin.vcstats = function (server, callback) {
        db.client.findOne({ type: 'vc-users' }, function (err, result) {
            if (result) {
               callback(result)
            } 
        });
    }

    //return true;
    return plugin;
};
