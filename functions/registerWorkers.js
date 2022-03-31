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
            console.log(`${this.id} befejezte a szolgálatot.`)
            sendLogMessage('Szolgálat leadás', `<@${this.id}> befejezte szolgálatot!`, 'RED')
        })       
    }
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

module.exports.PlayerStat = PlayerStat