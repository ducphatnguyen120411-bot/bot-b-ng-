const cron = require('node-cron');

const initDailySchedule = (client) => {
    // Chạy vào 7h sáng mỗi ngày
    cron.schedule('0 7 * * *', async () => {
        const channelId = 'YOUR_CHANNEL_ID'; // Thay bằng ID kênh Discord của bạn
        const channel = client.channels.cache.get(channelId);
        if (channel) {
            channel.send('🌅 Chào buổi sáng! Dưới đây là lịch thi đấu bóng đá hôm nay...');
        }
    });
};

module.exports = { initDailySchedule };
