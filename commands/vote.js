const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Bình chọn trận đấu'),
    async execute(interaction) {
        await interaction.reply('⚽ Đang mở cuộc bình chọn cho trận tối nay!');
    },
};
