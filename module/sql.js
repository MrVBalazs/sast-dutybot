const mysql = require('mysql');
const config = require('../config.json');

module.exports.con = mysql.createConnection({
    host: config.SQL.host,
    user: config.SQL.username,
    password: config.SQL.password,
    database: config.SQL.database,
});