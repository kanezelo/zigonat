const { Command } = require('discord.js-selfbot-v13');
const { universities } = require('../veritabani/uni-listesi.json'); // JSON'dan veri çek

module.exports = {
    name: "uni",
    description: "Kullanıcıya rastgele Türkiye üniversitesi atar",
    async execute(message, args) {
        // Etiketlenen kullanıcıyı kontrol et, eğer yoksa komutu yazan kullanıcıyı al
        const targetUser = message.mentions.users.first() || message.author;

        // Rastgele üniversite seçimi (JSON'dan gelen veriyi kullan)
        const randomUni = universities[Math.floor(Math.random() * universities.length)];
        
        // Özel efektlerle mesaj
        const messages = [
            `${targetUser} artık ${randomUni} bölümünde okuyor! 🎓`,
            `Yerleştirme sonuçları açıklandı! ${targetUser} ${randomUni}'ni kazandı! 🎉`,
            `Üniversite hayatı başlıyor! 🥳 ${targetUser} ${randomUni}'nde!`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Yanıtı gönderme
        await message.reply(randomMessage);
    }
};
