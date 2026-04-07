const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Xem thứ hạng của bạn'),
    async execute(interaction) {
        await interaction.reply(`📊 Thứ hạng của **${interaction.user.username}** đang được cập nhật!`);
    },
};
