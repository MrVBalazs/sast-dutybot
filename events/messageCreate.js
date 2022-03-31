const DataManager = require('../functions/dataManager.js')
const TimeManager = require('../functions/timeManager.js')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(message.author.bot) return;
            switch(message.content) {
                case '!time': {
                    message.reply(`Csa, Jelenlegi munkaidőd: ${TimeManager.formatSecondsAsString(await DataManager.getTimeById(message.author.id))}`)
                }
            }
    }
}