const axios = require('axios');

const fetchLiveScores = async () => {
    try {
        // Thay URL bằng endpoint API thực tế của bạn
        const response = await axios.get('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
        });
        return response.data.matches;
    } catch (error) {
        console.error('Lỗi gọi API Bóng đá:', error.message);
        return null;
    }
};

module.exports = { fetchLiveScores };
