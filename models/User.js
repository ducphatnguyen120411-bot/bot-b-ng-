const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    exp: { type: Number, default: 0 },
    roleLevel: { type: Number, default: 1 },
    lastVote: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
