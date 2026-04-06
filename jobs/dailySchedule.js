const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { fetchLiveScores } = require('../utils/api'); // Gọi hàm lấy data từ API

const initDailySchedule = (client) => {
    // Chạy vào 07:00 sáng mỗi ngày (Giờ hệ thống Render thường là UTC, 07:00 sáng VN là 00:00 UTC)
    // Nếu muốn đúng 7h sáng VN, bạn dùng: '0 0 * * *'
    cron.schedule('0 7 * * *', async () => {
        console.log('--- Đang gửi lịch thi đấu sáng nay ---');
        
        // 1. Lấy ID kênh gửi tin nhắn (Thay bằng ID kênh của bạn hoặc dùng biến .env)
        const channelId = process.env.SCHEDULE_CHANNEL_ID || 'ID_KENH_CUA_BAN';
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            return console.error('❌ Không tìm thấy kênh gửi lịch thi đấu!');
        }

        // 2. Gọi API lấy lịch thi đấu hôm nay
        const matches = await fetchLiveScores();

        // 3. Tạo giao diện Embed "xịn"
        const scheduleEmbed = new EmbedBuilder()
            .setTitle('📅 LỊCH THI ĐẤU BÓNG ĐÁ HÔM NAY')
            .setDescription(`Chào buổi sáng **${client.user.username}** gửi đến bạn danh sách các trận đấu tâm điểm ngày hôm nay.`)
            .setColor('#00ffcc')
            .setThumbnail('https://i.imgur.com/8Q9S6zB.png') // Icon quả bóng hoặc logo bot
            .setTimestamp()
            .setFooter({ text: 'Dữ liệu cập nhật từ Football API', iconURL: client.user.displayAvatarURL() });

        if (!matches || matches.length === 0) {
            scheduleEmbed.addFields({ name: 'Thông báo', value: 'Hôm nay không có trận đấu nào thuộc các giải đấu hàng đầu.' });
        } else {
            // Lấy tối đa 10 trận tiêu biểu để tránh quá dài
            const topMatches = matches.slice(0, 10);
            
            topMatches.forEach(match => {
                const time = new Date(match.utcDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                scheduleEmbed.addFields({
                    name: `🏆 ${match.competition.name}`,
                    value: `⏰ **${time}**: ${match.homeTeam.name} ⚔️ ${match.awayTeam.name}`,
                    inline: false
                });
            });
        }

        // 4. Gửi vào channel
        await channel.send({ embeds: [scheduleEmbed] });
        console.log('✅ Đã gửi lịch thi đấu thành công!');
    });
};

module.exports = { initDailySchedule };
