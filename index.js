require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

const { initDailySchedule } = require('./jobs/dailySchedule');
const { initAutoLive } = require('./jobs/autoLive');

// 1. Setup Express cho Render (Giữ bot sống 24/7)
const app = express();
app.get('/', (req, res) => res.send('Bot trạng thái: ONLINE 🟢'));
app.listen(process.env.PORT || 3000, () => console.log('🌍 Web server sẵn sàng!'));

// 2. Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Đã kết nối Database'))
    .catch(err => console.error('❌ Lỗi Database:', err));

// 3. Khởi tạo Bot (THÊM QUYỀN ĐỌC TIN NHẮN)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Bắt buộc phải có để dùng lệnh !
    ] 
});

client.commands = new Collection();

// 4. NẠP LỆNH SLASH TỰ ĐỘNG (Giữ nguyên nhưng thêm chống lỗi)
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

// 5. NẠP SỰ KIỆN TỰ ĐỘNG (Giữ nguyên nhưng thêm chống lỗi)
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// ==========================================
// 6. HỆ THỐNG LỆNH CỔ ĐIỂN (PREFIX COMMANDS)
// ==========================================
const PREFIX = '!'; 

client.on('messageCreate', async (message) => {
    // Bỏ qua tin nhắn của bot khác hoặc không bắt đầu bằng !
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Gõ: !rank
    if (command === 'rank') {
        message.reply(`📊 Đang load dữ liệu siêu cấp VIP cho **${message.author.username}**...`);
        // Nơi bạn chèn code làm thẻ ảnh Rank sau này
    }

    // Gõ: !vote
    if (command === 'vote') {
        message.channel.send('🔥 Đang tạo bảng dự đoán kết quả trận đấu...');
        // Nơi bạn chèn code tạo bảng Vote
    }
});

// 7. KÍCH HOẠT JOBS KHI BOT ĐÃ SẴN SÀNG
client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã lên sóng!`);
    
    // Kích hoạt lịch tự động gửi tin nhắn
    initDailySchedule(client);
    initAutoLive(client);
});

// Khởi động Bot
client.login(process.env.TOKEN);
