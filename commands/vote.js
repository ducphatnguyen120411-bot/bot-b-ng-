const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Dự đoán kết quả trận cầu tâm điểm hôm nay'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🔥 DERBY RỰC LỬA: BÌNH CHỌN NGAY!')
            .setDescription('Trận đấu siêu kinh điển chuẩn bị diễn ra. Hãy chọn đội bóng bạn tin là sẽ giành chiến thắng để nhận ngay **+10 EXP** vào thẻ thành viên!')
            .setColor('#E74C3C')
            .addFields(
                { name: 'Đội Nhà', value: 'Manchester City', inline: true },
                { name: 'VS', value: '⚔️', inline: true },
                { name: 'Đội Khách', value: 'Manchester United', inline: true }
            )
            .setFooter({ text: 'Hệ thống đánh giá chuyên nghiệp', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('vote_home')
                    .setLabel('Man City Thắng')
                    .setEmoji('🔵')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('vote_away')
                    .setLabel('Man Utd Thắng')
                    .setEmoji('🔴')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('vote_draw')
                    .setLabel('Hòa')
                    .setEmoji('⚖️')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
