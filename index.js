const { initEvents, login } = require('./module/bot.js');
const { con } = require('./module/sql.js');

initEvents()
login()
con.connect(function(err) {
    if(err) throw err
})

var d = new Date();
console.log(d.getTime()/1000)
