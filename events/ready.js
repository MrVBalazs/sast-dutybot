const { onlineCheck, onlineCheckUSM } = require('../intervals/onlineCheck.js')
const { startStatMonitor } = require('../intervals/statMonitor.js')
const {startStatMonitorUSM } = require('../intervals/statMonitorUSM.js')
const { fetchUserById } = require('../functions/fetchDiscordMember.js');
const {initMissingTimes } = require('../functions/registerWorkers.js')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        initMissingTimes();
        onlineCheck(client)
        onlineCheckUSM(client)
        startStatMonitor(client)
        startStatMonitorUSM()
        
    }
}