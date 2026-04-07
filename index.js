require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

// --- GIẢI QUYẾT LỖI PORT TRÊN RENDER ---
const app = express();
app.get('/', (req, res) => res.send('Bot Football is Running!'));
app.listen(process.env.PORT || 3000, () => console.log('✅ Cổng Web đã mở!'));

// --- KẾT NỐI DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Database Connected!'))
    .catch(err => console.error('❌ Lỗi Database:', err));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

// --- TỰ ĐỘNG NẠP COMMANDS ---
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

// --- TỰ ĐỘNG NẠP EVENTS ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(process.env.TOKEN);
