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
    plugin.getInstance = function (inputid) {
        api.getZones(function (err, data) {
            //console.log(data["id"].name);

            let lines = 'default';
            Object.keys(data).forEach(function (id) {
                if (data[id].id === inputid) {
                    lines = id + ' Zone-ID: ' + data[id].id + ' -> ' + data[id].name + '\n';
                    console.log(data[id].name);
                    return data[id].name
                    
                }
            });

        });
    }
    plugin.getLastLog = function (userinput, callback) {
        var guild = "in Harmony";
        var realm = "Blackhand";
        console.log('into getLastLog Module')
        //Params
        var lastlog = {};
        var OneWeek = 604800000;
        //Optional parameters for the api call. 
        var params = { start: Date.now() - OneWeek };

        //Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
        api.getReportsGuild(guild, realm, 'eu', params, function (err, data) {

            if (err) {
                //We caught an error, log the error object to the console and exit. 
                console.log(err);
                return;
            }
            //Success, log the whole data object to the console. 
            console.log(data);
            callback(data);
        });

    }




    return plugin;
};