const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { fetchLiveScores } = require('../utils/api');

const initAutoLive = (client) => {
    // Chạy mỗi 15 phút (*/15 * * * *) để cập nhật tỉ số các trận đang đá
    cron.schedule('*/15 * * * *', async () => {
        console.log('⚽ Đang kiểm tra tỉ số trực tuyến...');

        const matches = await fetchLiveScores();
        if (!matches || matches.length === 0) return;

        // Lọc các trận đang diễn ra (Status: IN_PLAY hoặc LIVE)
        const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'LIVE');

        if (liveMatches.length === 0) {
            console.log('Hiện không có trận đấu nào đang diễn ra.');
            return;
        }

        const channelId = process.env.LIVE_CHANNEL_ID || 'ID_KENH_TISO_CUA_BAN';
        const channel = client.channels.cache.get(channelId);

        if (!channel) return;

        const liveEmbed = new EmbedBuilder()
            .setTitle('🔥 CẬP NHẬT TỈ SỐ TRỰC TUYẾN')
            .setColor('#FF0000') // Màu đỏ đặc trưng cho Live
            .setTimestamp()
            .setFooter({ text: 'Dữ liệu trực tiếp từ SVĐ', iconURL: client.user.displayAvatarURL() });

        liveMatches.forEach(match => {
            liveEmbed.addFields({
                name: `🏆 ${match.competition.name}`,
                value: `🔴 **LIVE**: ${match.homeTeam.name} **${match.score.fullTime.home} - ${match.score.fullTime.away}** ${match.awayTeam.name}`,
                inline: false
            });
        });

        await channel.send({ embeds: [liveEmbed] });
        console.log(`✅ Đã cập nhật tỉ số cho ${liveMatches.length} trận đấu.`);
    });
};

module.exports = { initAutoLive };
