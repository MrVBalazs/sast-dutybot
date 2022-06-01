const { con } = require('../module/sql.js')
const config = require('../config.json')
const { sendLogMessage } = require('../functions/logManager.js')

class PlayerStat {
    constructor(id, starttime, grade, job) {
        this.id = id;
        this.starttime = starttime;
        this.stringformat = `<@${id}>`
        this.grade = grade
        this.job = job

        setStartTime(this.id)
        console.log(`${id} elkezdte a szolgálatot.`)
        sendLogMessage('Szolgálatba lépés', `<@${id}> szolgálatba lépett!`, 'GREEN')

    }
    getCurrentTime() {
        const currentDate = new Date();
        return Math.round((currentDate.valueOf() - this.starttime) / 60000)
    }

    async confirmSql() {
        if(await isPlayerInSQL(this.id))
            return;
        else await registerPlayer(this.id, this.grade);
    }
    closeTime() {
        this.confirmSql().then(() => {
            addWorkedTime(this.id, this.getCurrentTime())
            stopStartTime(this.id)
            console.log(`${this.id} befejezte a szolgálatot.`)
            sendLogMessage('Szolgálat leadás', `<@${this.id}> befejezte szolgálatot!`, 'RED')

            if(this.job == "usm")
            updateRoleUSM(this.id, this.grade)
        })       
    }
}

function updateRoleUSM(id, grade) {
    if(config.rolesUSM.split(';').includes(grade))
        con.query(`UPDATE ${config.SQL.table} SET grade="USM-${grade}" WHERE discord="${id}"`)
        else console.log("Nincs találat.");
}

function isPlayerInSQL(id) {
    return new Promise(function(resolve) {
        con.query(`SELECT 1 FROM ${config.SQL.table} WHERE discord = '${id}'`, function(err, result) {
            if(err) console.log(err)
            resolve(result.length == 1)
        })
    })
}

function registerPlayer(id, grade) {
    if(config.roles.findIndex(v => v.label == grade) != -1)
        con.query(`INSERT INTO ${config.SQL.table} (discord, time, grade) VALUES ('${id}', '0', '${config.roles[config.roles.findIndex(v => v.label == grade)].id}')`)
    else con.query(`INSERT INTO ${config.SQL.table} (discord, time, grade) VALUES ('${id}', '0', null)`)
}

function addWorkedTime(id, time) {
    con.query(`UPDATE ${config.SQL.table} SET time=time+${time} WHERE discord='${id}'`)
}

function setStartTime(id) {
    con.query(`UPDATE ${config.SQL.table} SET startTime=${new Date().getTime()/1000} WHERE discord=${id}`)
}
function stopStartTime(id) {
    con.query(`UPDATE ${config.SQL.table} SET startTime=null where discord=${id}`)
}

function initMissingTimes() {
    con.query(`SELECT discord, time, startTime from ${config.SQL.table} where startTime IS NOT NULL`, (err, result) => {
        if(err) throw err;
        else {
            sendLogMessage(`${result.length} személy adata nem került mentésre`, `Az adatok mentésre kerülnek.`, "RED")
            result.forEach(player => {
                var time = Math.round((new Date().getTime()/1000-player.startTime)/60)
                addWorkedTime(player.discord, time)
                stopStartTime(player.discord)
                sendLogMessage("Helyreállítás", `<@${player.discord}> játékosnak ${time} percnyi idő helyreállítva.`)
            });
        }
    })
}


module.exports.PlayerStat = PlayerStat;
module.exports.initMissingTimes = initMissingTimes;