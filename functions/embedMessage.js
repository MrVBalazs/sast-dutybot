const { MessageEmbed } = require('discord.js')

module.exports = {
    DefaultEmbed (title, description, color) {
        return new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
    },
    StatusEmbed (job, induty, outofduty) {
        return new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK")
            .setTitle(`${job} - Városban lévő állománytagok`)
            .setDescription(`Szolgálatban lévő állománytagok: ${induty.split("\n").length}\nSzolgálaton kívüli állománytagok: ${outofduty.split("\n").length}`)
            .setThumbnail(job == "S.A.S.T" ? 'https://i.imgur.com/p2A79Y0.png' : "https://i.imgur.com/lX7dwaC.png")
            .setTimestamp()
            .addFields(
                { name: "Szolgálatban lévők:", value: induty, inline: true },
                { name: "Szolgálaton kívül lévők:", value: outofduty, inline: true }
            );
    }
}