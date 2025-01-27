// Kahve Falı ("fal") Komutu
const mongoose = require('mongoose');

// Fal koleksiyonu için şema tanımı
const falSchema = new mongoose.Schema({
    içerik: String
});

const Fal = mongoose.model('Fal', falSchema);

module.exports = {
    name: 'fal',
    description: 'Rastgele bir kahve falı gösterir.',
    async execute(message, args) {
        // MongoDB'den rastgele bir fal çek
        const falSayısı = await Fal.countDocuments();
        if (falSayısı === 0) {
            return message.reply('Henüz hiç kahve falı eklenmedi. Lütfen bir yönetici fal eklesin.');
        }

        const rastgeleIndex = Math.floor(Math.random() * falSayısı);
        const fal = await Fal.findOne().skip(rastgeleIndex);

        if (!fal) {
            return message.reply('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
        }

        message.reply(`☕ Kahve Falın: **${fal.içerik}**`);
    },
};