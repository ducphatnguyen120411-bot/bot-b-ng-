const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const User = require('../models/User');
const { generateRankBanner } = require('../utils/bannerMaker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Xem thẻ chỉ số bóng đá của bạn'),
    async execute(interaction) {
        await interaction.deferReply(); // Báo cho Discord biết bot cần thời gian tạo ảnh

        const user = await User.findOne({ userId: interaction.user.id }) || { exp: 0, roleLevel: 1 };
        
        // Lấy link avatar (ưu tiên định dạng PNG)
        const avatarUrl = interaction.user.displayAvatarURL({ extension: 'png', size: 256 });
        const username = interaction.user.globalName || interaction.user.username;

        const buffer = await generateRankBanner(username, user.exp, user.roleLevel, avatarUrl);
        const attachment = new AttachmentBuilder(buffer, { name: 'pro-rank.png' });

        await interaction.editReply({ files: [attachment] });
    }
};
