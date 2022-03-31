const { client } = require('../module/bot.js')
const config = require('../config.json');

module.exports = {
    async fetchUserById(id) {
        let userMember
        await client.users.fetch(id).then(user => { 
            userMember = user
        })
        return userMember
    },
    async getRolesById(id) {
        var collectedMembers = []
        await (await client.guilds.fetch(config.bot.server)).then(async guild => {
            await guild.roles.fetch(id).then(async role => {
                role.members.forEach(member => {
                    collectedMembers.push(member);
                });
            });
        });
        return collectedMembers
    }
}