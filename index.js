require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');

// --- 1. SETUP EXPRESS (Giữ Bot online trên Render) ---
const app = express();
app.get('/', (req, res) => res.send('Bot trạng thái: ONLINE 🟢'));
app.listen(process.env.PORT || 3000, () => console.log('🌍 Web server sẵn sàng!'));

// --- 2. KẾT NỐI DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Đã kết nối Database thành công!'))
    .catch(err => console.error('❌ Lỗi Database:', err));

// --- 3. KHỞI TẠO BOT (CẤP FULL QUYỀN ĐỌC TIN NHẮN) ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Quyền sinh tử để đọc lệnh có dấu !
    ] 
});

// --- 4. HỆ THỐNG LỆNH GÕ TRỰC TIẾP (PREFIX) ---
const PREFIX = '!'; 

client.on('messageCreate', async (message) => {
    // Bỏ qua tin nhắn của bot khác hoặc không có dấu !
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    // Tách lệnh và tham số
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 🟢 Lệnh Test (Gõ !ping)
    if (command === 'ping') {
        return message.reply('🏓 Pong! Bot đang hoạt động cực mượt!');
    }

    // 🟢 Lệnh Rank (Gõ !rank)
    if (command === 'rank') {
        return message.reply(`📊 Đang load dữ liệu siêu cấp VIP cho **${message.author.username}**...`);
    }

    // 🟢 Lệnh Vote (Gõ !vote)
    if (command === 'vote') {
        return message.channel.send('🔥 Đang tạo bảng dự đoán kết quả trận đấu hôm nay...');
    }
});

// --- 5. CHẠY JOBS (LỊCH TỰ ĐỘNG) ---
client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã lên sóng và sẵn sàng nhận lệnh!`);
    
    // Bọc trong try-catch để nếu file jobs lỗi thì bot vẫn sống
    try {
        const { initDailySchedule } = require('./jobs/dailySchedule');
        const { initAutoLive } = require('./jobs/autoLive');
        initDailySchedule(client);
        initAutoLive(client);
        console.log('✅ Đã kích hoạt hệ thống Lịch tự động!');
    } catch (error) {
        console.log('⚠️ Không tìm thấy hoặc lỗi file Jobs, đang bỏ qua phần tự động...');
    }
});

// --- 6. ĐĂNG NHẬP BOT ---
client.login(process.env.TOKEN);
