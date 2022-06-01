const { con } = require('../module/sql.js')
const config = require('../config.json')

module.exports = {
    getTimeById (clientid) {
        return new Promise(function(resolve) {
            con.query(`SELECT time FROM ${config.SQL.table} WHERE discord = ${clientid}`, (err, result) => {
                if(err) resolve(err)
                else resolve(result[0] ? result[0].time : 0);
            })
        })
    }
}