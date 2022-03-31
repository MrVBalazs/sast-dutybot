const { getPoliceJSON, getPoliceJSONUSM } = require('../functions/getPoliceJson.js')
const { StatusEmbed } = require('../functions/embedMessage.js')
const { PlayerStat } = require('../functions/registerWorkers.js');
const config = require('../config.json')

var inDuty = []
var outOfDuty = []

function onlineCheck(client) {
    client.channels.fetch(config.channels.info).then((channel) => {
        channel.bulkDelete(1)
        .catch(console.error);
        channel.send({embeds: [StatusEmbed("--\n", "--\n")]}).then((msg) => {
            setInterval( async function() {
                checkDuty()
                msg.edit({embeds: [StatusEmbed(inDuty.length != 0 ? inDuty.map((row) => { return `<@${row.id}> [${row.getCurrentTime()}p]` }).join('\n') : "--\n", outOfDuty.length != 0 ? outOfDuty.join('\n') : "--\n")]})            
            }, 13000);
        })
    }) 
}

function onlineCheckUSM(client) {
    client.channels.fetch(config.channels.usm.info).then((channel) => {
        channel.bulkDelete(1)
        .catch(console.error);
        channel.send({embeds: [StatusEmbed("--\n", "--\n")]}).then((msg) => {
            setInterval(async function() {
                checkDutyUSM()
                msg.edit({embeds: [StatusEmbed(inDuty.length != 0 ? inDuty.map((row) => { return `<@${row.id}> [${row.getCurrentTime()}p]` }).join('\n') : "--\n", outOfDuty.length != 0 ? outOfDuty.join('\n') : "--\n")]})  
            })
        })
    })
}

function checkDuty() {
    getPoliceJSON().then(rawData => {
        const onlinePolices = JSON.parse(rawData);
        updateDuty(onlinePolices);
        onlinePolices.forEach(playerData => {
            if(playerData.job.grade_name != 'offduty') {
                if(!inDuty.map((row) => {return row.id}).includes(playerData.discord))
                    inDuty.push(new PlayerStat(playerData.discord, new Date().valueOf(), playerData.job.grade_label, "sast"))
            }
            else outOfDuty.push(`<@${playerData.discord}>`)
        });
    })

}

function checkDutyUSM() {
    getPoliceJSONUSM().then(rawData => {
        console.log(rawData)
        const onlineUSM = JSON.parse(String(rawData));
        updateDuty(onlineUSM)
        onlineUSM.forEach(playerData => {
            if(playerData.job.grade_name != 'offduty') {
                if(!inDuty.map((row) => {return row.id}).includes(playerData.discord))
                    inDuty.push(new PlayerStat(playerData.discord, new Date().valueOf(), playerData.job.grade_label, "usm"))
            }
            else outOfDuty.push(`<@${playerData.discord}`)
        });
    })
}

function updateDuty(obj) {
    inDuty.forEach(dutyRow => {
        if(!obj.map((row) => {return row.discord}).includes(dutyRow.id)) {
            dutyRow.closeTime();
            inDuty.splice(inDuty.findIndex(v => v.id == dutyRow.id), 1)
        } else {
            if(outOfDuty.includes(`<@${dutyRow.id}>`)) {
                dutyRow.closeTime();
                inDuty.splice(inDuty.findIndex(v => v.id == dutyRow.id), 1)
            }
        }
    });
    outOfDuty.length = 0
}

module.exports.onlineCheck = onlineCheck
module.exports.inDuty = inDuty
module.exports.onlineCheckUSM = onlineCheckUSM