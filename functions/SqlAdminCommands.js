const { con } = require('../module/sql.js')
const config = require('../config.json')

module.exports = {
    ResetTimes(isSast) {
        con.query(`UPDATE ${config.SQL.table} SET time=0 WHERE grade ${isSast ? "NOT LIKE \'USM-%\'" : "LIKE \"USM-%\""}`, (err, result) => {
            if(err) return false
                return true
        })
    },
    AddTime(userid, time) {
        con.query(`UPDATE ${config.SQL.table} SET time=time+${time} where discord="${userid}"`, (err, result) => {
            if(err) throw err
            return true
        })
    },
    ResetUserTime(userid) {
        con.query(`UPDATE ${config.SQL.table} SET time=0 WHERE discord="${userid}"`, (err, result) => {
            if(err) throw err
            return true
        })
    },
    DropUser(userid) {
        con.query(`DELETE FROM ${config.SQL.table} WHERE discord="${userid}"`, (err, result) => {
            if(err) throw err;
            return true;
        })
    },
    MaxTime(isSast) {
        return new Promise(async function(resolve) {
            con.query(`SELECT discord, MAX(time) as maxtime from ${config.SQL.table} WHERE grade ${isSast ? "NOT LIKE 'USM-%'" : "LIKE 'USM-%'"}`, (err, result) => {
                if(err) throw err;
                resolve({clientId: result[0].discord, time: result[0].maxtime})
            })
        })
    }
}