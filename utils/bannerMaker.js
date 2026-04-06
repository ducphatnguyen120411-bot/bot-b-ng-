const { createCanvas, loadImage } = require('canvas');

const generateRankBanner = async (username, exp, level, avatarUrl) => {
    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext('2d');

    // 1. Vẽ Background Gradient nền tối
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#141E30');
    gradient.addColorStop(1, '#243B55');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Tải và vẽ Avatar bo tròn
    const avatar = await loadImage(avatarUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 50, 50, 150, 150);
    ctx.restore();

    // 3. Vẽ vòng viền cho Avatar
    ctx.beginPath();
    ctx.arc(125, 125, 75, 0, Math.PI * 2, true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#00ffcc';
    ctx.stroke();

    // 4. In thông tin Username và Level
    ctx.font = 'bold 45px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, 230, 110);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#00ffcc';
    ctx.fillText(`LEVEL ${level}`, 230, 160);

    // 5. Thanh Progress Bar (Kinh nghiệm)
    const expNeeded = level * 100; // Công thức exp đơn giản
    const currentExp = exp % 100; // Exp hiện tại của level này
    const progressWidth = 450;
    
    // Viền thanh exp
    ctx.fillStyle = '#444444';
    ctx.beginPath();
    ctx.roundRect(230, 180, progressWidth, 25, 10);
    ctx.fill();

    // Thanh exp đã đạt được
    const fillWidth = (currentExp / 100) * progressWidth;
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.roundRect(230, 180, fillWidth, 25, 10);
    ctx.fill();

    // Text tỉ lệ exp
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${currentExp} / 100 EXP`, 690, 198);

    return canvas.toBuffer();
};

module.exports = { generateRankBanner };
