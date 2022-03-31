const { client } = require('../module/bot.js');
const { DefaultEmbed } = require('../functions/embedMessage.js')
const config = require('../config.json')

module.exports = {
    sendLogMessage (title, description, color) {
        client.channels.fetch(config.channels.log).then(channel => {
            channel.send({embeds: [DefaultEmbed(title, description, color)]})
        })
    }
}