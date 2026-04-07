const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🤖 Bot ${client.user.tag} đã online!`);
        
        // Chạy các tác vụ tự động (Jobs)
        try {
            const { initDailySchedule } = require('../jobs/dailySchedule');
            const { initAutoLive } = require('../jobs/autoLive');
            initDailySchedule(client);
            initAutoLive(client);
        } catch (e) {
            console.log('⚠️ Jobs chưa sẵn sàng hoặc thiếu file.');
        }
    },
};
