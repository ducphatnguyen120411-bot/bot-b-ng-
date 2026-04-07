require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`⏳ Đang báo cáo ${commands.length} lệnh Slash (/) lên Discord...`);

        // Đăng ký lệnh trên toàn bộ các server có bot
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), 
            { body: commands },
        );

        console.log(`✅ Đăng ký thành công ${data.length} lệnh! (Mất 1-3 phút để Discord cập nhật menu)`);
    } catch (error) {
        console.error('❌ Lỗi đăng ký lệnh:', error);
    }
})();
