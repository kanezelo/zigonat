const User = require('../models/User');

// Kullanıcıya coin ekleme fonksiyonu
async function addCoins(userId, amount) {
    try {
        const user = await User.findOneAndUpdate(
            { userId: userId },
            { $inc: { coins: amount } },
            { new: true, upsert: true }
        );
        return user.coins;
    } catch (err) {
        console.error('Coin ekleme hatası:', err);
        return null;
    }
}

// Kullanıcı bakiyesini kontrol etme fonksiyonu
async function getCoins(userId) {
    try {
        const user = await User.findOne({ userId: userId });
        return user ? user.coins : 0;
    } catch (err) {
        console.error('Bakiye sorgulama hatası:', err);
        return 0;
    }
}

module.exports = { addCoins, getCoins };
