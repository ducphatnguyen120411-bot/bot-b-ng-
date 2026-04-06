const User = require('../models/User');

const addExp = async (userId, member, amount) => {
    let user = await User.findOne({ userId });
    if (!user) {
        user = new User({ userId });
    }
    
    user.exp += amount;
    
    // Logic thăng cấp đơn giản (cứ 100 exp lên 1 cấp)
    const newLevel = Math.floor(user.exp / 100) + 1;
    if (newLevel > user.roleLevel) {
        user.roleLevel = newLevel;
        // Logic add role Discord thực tế ở đây
        // const roleId = 'YOUR_ROLE_ID';
        // await member.roles.add(roleId);
    }
    
    await user.save();
    return user;
};

module.exports = { addExp };
