const { MessageActionRow, MessageButton } = require('discord.js');
const { getBotEmbed } = require('../../otherFunctions/botEmbed')

module.exports.run = async (interaction) => {
    const bot = require('../../../index');

    const messageComponents = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('like-bot-button')
                .setLabel('Like')
                .setStyle('SUCCESS')
                .setEmoji('♥️'),
            new MessageButton()
                .setCustomId('dislike-bot-button')
                .setLabel('Dislike')
                .setStyle('DANGER')
                .setEmoji('😭'),
            new MessageButton()
                .setCustomId('help-bot-button')
                .setLabel('Help')
                .setStyle('SECONDARY'),
        );
    await interaction.reply({ embeds: [await getBotEmbed(bot)], components: [messageComponents] });
}

module.exports.help = {
    category: "Information",
    name: 'chthulu',
    description: 'Information about the bot!',
}