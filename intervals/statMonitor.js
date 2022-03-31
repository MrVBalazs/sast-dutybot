const config = require('../config.json');
const { con } = require('../module/sql.js')
const { DefaultEmbed } = require('../functions/embedMessage.js')
const TimeManager = require('../functions/timeManager.js')

function startStatMonitor(client) {
    client.channels.fetch(config.channels.stat).then(async (channel) => {
        channel.bulkDelete(1)
        .catch(console.error)
        var data =  await processData()
        console.log(data.length)
        channel.send({embeds: data.slice(0, 10)}).then(msg => {
            setInterval(async () => {
                msg.edit({embeds: (await processData()).slice(0, 10)})
            }, 60000);
        })
        channel.send({embeds: data.slice(11, 16)}).then(msg => {
            setInterval(async () => {
                msg.edit({embeds: (await processData()).slice(11, 16)})
            }, 60000);
        })
    })
}

function getAllStatData() {
    return new Promise(function(resolve) {
        con.query(`SELECT * from ${config.SQL.table}`, function(err, result) {
            if(err) console.log(err)
            resolve(result)
        })
    })
}

function processData() {
    return new Promise(function(resolve) {
        var embedList = []
        getAllStatData().then((DATAOBJ) => {
            embedList.length = 0;
            config.roles.forEach(roleListRow => {
                var collectedData = DATAOBJ.filter(v => v.grade == roleListRow.id).length != 0 ? DATAOBJ.filter(v => v.grade == roleListRow.id)
                .map(v => {return `**Név:** <@${v.discord}> **Össz. munkaidő:** ${TimeManager.formatSecondsAsString(v.time)} `})
                .join('\n') : "N/A"
                embedList.push( DefaultEmbed(`S.A.S.T Munkaidő percben - ${roleListRow.label}`, collectedData, "GREEN"));
            });
            resolve(embedList)
        })
        
    })
    
}

module.exports.startStatMonitor = startStatMonitor;