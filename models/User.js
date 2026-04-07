const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
});

module.exports = mongoose.model('User', userSchema);
