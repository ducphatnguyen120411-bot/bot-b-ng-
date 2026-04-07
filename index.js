require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

// --- 1. KẾT NỐI DATABASE ---
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Đã kết nối Database MongoDB!'))
        .catch(err => console.error('❌ Lỗi kết nối Database:', err));
}

// --- 2. TẠO WEB SERVER (Cho Render giữ bot 24/7) ---
const app = express();
app.get('/', (req, res) => res.send('Bot đang chạy mượt mà! 🟢'));
app.listen(process.env.PORT || 3000, () => console.log('🌍 Web server đã sẵn sàng!'));

// --- 3. KHỞI TẠO BOT ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ] 
});

client.commands = new Collection();

// --- 4. TẢI LỆNH TỪ FOLDER 'commands' ---
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Đã nạp lệnh: /${command.data.name}`);
        }
    }
}

// --- 5. TẢI SỰ KIỆN TỪ FOLDER 'events' ---
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

// --- 6. KÍCH HOẠT JOBS KHI BOT ONLINE ---
client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã online và sẵn sàng!`);
    
    try {
        const { initDailySchedule } = require('./jobs/dailySchedule');
        const { initAutoLive } = require('./jobs/autoLive');
        initDailySchedule(client);
        initAutoLive(client);
        console.log('✅ Đã kích hoạt hệ thống Lịch thi đấu & Live!');
    } catch (error) {
        console.log('⚠️ Bỏ qua chạy Jobs do lỗi file:', error.message);
    }
});

// --- 7. ĐĂNG NHẬP ---
client.login(process.env.TOKEN).catch(err => console.error('❌ Lỗi Token:', err));
