/*
    RestartTracker

    Author:  Krasserdudu
    Twitter: @gexooo

    Description:
        Tracks if a restart was called by an Admin
*/

module.exports = function plugin(client, container, pconfig) {

    // reference---------------------------------
    const config = container.config;
    const db = container.db;
    const util = container.util;
    // plugin------------------------------------
    let receivedCMD;

    // Check if DB-Entity exists
    client.on('dbready', function () {
        db.client.findOne({ type: 'restart-stats' }, function (err, restartStats) {
            if (restartStats) {
                receivedCMD = restartStats.cmd;
                if (receivedCMD == true) {
                    util.log('Bot was restarted by '+ restartStats.from)
                    var timeToRestart = (Date.now() - restartStats.cmd_received)/1000
                    client.sendMessage({
                        to: restartStats.chanID,
                        message: "\`restart completed. it took " + timeToRestart +"s \`"
                    }, function() {
                        db.client.update({
                            type: 'restart-stats',
                        }, {
                            $set: {
                                cmd: false,
                            }
                            });
                    });
                }

            } else {
                // create the restart stats entry and save it
                restartStats = {
                    type: 'restart-stats',
                    cmd: false,
                    from: "",
                    chanID: ""
                };
                // insert the stats
                db.client.insert(restartStats, function (err, restartStats) {
                    receivedCMD = restartStats.cmd;
                });
            }
        });
    });


    return true;
};
