const config = require('../config.json');
const { updateRoleSQL } = require('../functions/roleUpdate.js');
const { sendLogMessage } = require('../functions/logManager.js')

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(oldMember, newMember) {
        newMember.roles.cache.forEach(role => {
            if(config.roles.findIndex(v => v.id == role.id) != -1) {
                updateRoleSQL(newMember.id, role.id)
                console.log(`${newMember.id} [${newMember.displayName}] új role idja: ${role.id}`)
                sendLogMessage('Role módosítás', `<@${newMember.id}> [${newMember.displayName}] új role-t kapott: **${role.name}**`, 'YELLOW')
                console.log(newMember)
            }
        });
    }
}