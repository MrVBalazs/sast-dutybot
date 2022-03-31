const { Client, Intents } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});

const config = require('../config.json')

const fs = require('fs')
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

function initEvents() {
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

function login() {
    client.login(config.bot.TOKEN)
    console.log("Bot csatlakozott Discord szerverekhez.")
}

module.exports = { Client, client, initEvents, login }