const { addExp } = require('../utils/expSystem');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Có lỗi khi thực thi lệnh này!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('vote_')) {
                // Cộng 10 EXP khi vote
                await addExp(interaction.user.id, interaction.member, 10);
                await interaction.reply({ content: `✅ Bạn đã bình chọn thành công và nhận được 10 EXP!`, ephemeral: true });
            }
        }
    }
};
