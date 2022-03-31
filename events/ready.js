const { onlineCheck, onlineCheckUSM } = require('../intervals/onlineCheck.js')
const { startStatMonitor } = require('../intervals/statMonitor.js')
const { fetchUserById } = require('../functions/fetchDiscordMember.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        onlineCheck(client)
        onlineCheckUSM(client)
        startStatMonitor(client)
    }
}