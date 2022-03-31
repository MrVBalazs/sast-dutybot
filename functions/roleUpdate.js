const { con } = require('../module/sql.js');
const config = require('../config.json');

module.exports = {
    updateRoleSQL(clientId, roleId) {
        con.query(`UPDATE ${config.SQL.table} SET grade = ${roleId} WHERE discord = ${clientId}`);
    }
}