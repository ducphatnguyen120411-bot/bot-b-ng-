require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

const { initDailySchedule } = require('./jobs/dailySchedule');
const { initAutoLive } = require('./jobs/autoLive');

// Setup Express cho Render
const app = express();
app.get('/', (req, res) => res.send('Bot trạng thái: ONLINE 🟢'));
app.listen(process.env.PORT || 3000, () => console.log('🌍 Web server sẵn sàng!'));

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Đã kết nối Database'))
    .catch(err => console.error('❌ Lỗi Database:', err));

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

client.commands = new Collection();

// 1. NẠP LỆNH TỰ ĐỘNG (Dynamic Command Handling)
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// 2. NẠP SỰ KIỆN TỰ ĐỘNG (Dynamic Event Handling)
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Chạy Bot
client.login(process.env.TOKEN);
