const { getCoins } = require('../util/coinManager');

module.exports = {
    name: "bakiye",
    description: "Coin bakiyenizi veya etiketlediğiniz kişinin bakiyesini gösterir.",
    async execute(message, client) {
        // Eğer bir kullanıcı etiketlenmişse, onun ID'sini al
        const hedefKullanici = message.mentions.users.first();
        const userId = hedefKullanici ? hedefKullanici.id : message.author.id;

        // Kullanıcının coin bakiyesini getir
        const bakiye = await getCoins(userId);

        if (hedefKullanici) {
            message.channel.send(`💰 **${hedefKullanici.username}** adlı kullanıcının bakiyesi: **${bakiye}** coin.`);
        } else {
            message.channel.send(`💰 Mevcut bakiyeniz: **${bakiye}** coin.`);
        }
    }
};
