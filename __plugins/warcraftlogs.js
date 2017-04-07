/*
    warcraftlogs plugin ..wclprovider

    Author:  krasserdudu
    Twitter: @gexooo

    Description:
        GETTING SOME WARCRAFTLOGS
*/

module.exports = function plugin(bot, container, pconfig) {

    // reference---------------------------------
    const api = require('weasel.js');

    //Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
    api.setApiKey(pconfig.api);
    // plugin------------------------------------
    // new module for counting the users in channel
    plugin.getInstance = function (name) {
        api.getZones(function (err, data) {
            //console.log(data["id"].name);
            let lines = '';
            Object.keys(data).forEach(function (id) {
                if (data[id].id === name) {
                    lines += id + ' Zone-ID: ' + data[id].id + ' -> ' + data[id].name + '\n';
                }
            });
        });
        return lines;
    }

    return plugin;
};