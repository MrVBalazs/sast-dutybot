const DataManager = require('../functions/dataManager.js')
const TimeManager = require('../functions/timeManager.js')
const {Permissions} = require('discord.js')
const config = require('../config.json')
const aSql = require('../functions/SqlAdminCommands.js')
const { formatSecondsAsString } = require('../functions/timeManager.js')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if(message.author.bot) return;
        if(!message.content.startsWith("!")) return;
            switch(message.content) {
                case '!time': {
                    message.reply(`Jelenlegi munkaidőd: ${TimeManager.formatSecondsAsString(await DataManager.getTimeById(message.author.id))}`)
                    break;
                }
                case '!sex': {
                    var gifs = config.femboyGifs.split(';');
                    message.reply(gifs[Math.floor(Math.random() * gifs.length)]);
                    break;
                }
                case '!deletealltimes': {
                    if(message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                        switch(message.guild.id) {
                            case config.servers.sast: {
                                aSql.ResetTimes(true)
                                break;
                            }
                            case config.servers.usm: {
                                aSql.ResetTimes(false)
                                break;
                            }
                            default: {
                                message.reply("egyik sem")
                                break;
                            }
                        }
                    } else message.reply('Kicsi vagy még ehhez.')
                    break;
                }
            }

            if(message.content.startsWith("!addtime") || message.content.startsWith("!removetime")) {
                var args = message.content.split(' ');
                if(!args[1] || !args[2]) message.reply('Nem adtál meg argumentumot!\nHelyes használat: !addtime/!removetime <felhasznalo> <perc>');
                else {
                    var mentioned = message.mentions.members.first()
                    if(mentioned)
                    aSql.AddTime(mentioned.id, message.content.startsWith("!addtime") ? args[2] : args[2]*-1)
                    else message.reply('Nem jelöltél meg egy játékost!')
                }
            }
            if(message.content.startsWith("!deltime")) {
                var args = message.content.split(' ')
                if(!args[1]) message.reply('Nem adtál meg argumentumot!\nHelyes használat: !deltime <felhasznalo>')
                else {
                    var mentioned = message.mentions.members.first()
                    if(mentioned)
                        aSql.ResetUserTime(mentioned.id)
                        else message.reply('Nem jelöltél meg egy játékost!');
                }
            }
            if(message.content.startsWith("!dropuser")) {
                var args = message.content.split(' ')
                if(!args[1]) message.reply('Nem adtál meg argumentumot!\nHelyes használat: !dropuser <felhasznalo>')
                else {
                    var mentioned = message.mentions.members.first()
                    if(mentioned)
                    aSql.DropUser(mentioned.id)
                    else {
                        console.log(args[1].length)
                        if(args[1].length == 18) // Length of UserId
                            aSql.DropUser(args[1])
                        else
                            message.reply('Nem jelöltél meg egy játékost!');
                    }
                }
            }
            if(message.content.startsWith("!dropthese")) {
                var args = message.content.split(' ');
                if(!args[1]) message.reply('Nem adtál meg argumentumot!\nHelyes használat: !dropthese <felhasznalo1> <felhasznalo2> <felhasznalo3> ...\n\nFontos csak ID-ket adj meg, ne pingeld!')
                else
                {
                    for(let i=1;i<args.length;i++)
                        if(args[1].length == 18) // Length of UserId
                            aSql.DropUser(args[i]);
                        else message.reply(`A ${i}. argumentum (${args[i]} ~ <@${args[i]}>) megadása helytelen! Csekkolj rá.`);
                }
            }

            if(message.content.startsWith('!leader')) {
                var leader = await aSql.MaxTime();
                message.reply(`Vezető személy: <@${leader.clientId}> | Ideje: ${formatSecondsAsString(leader.time)} perc`)
            }
    }
}