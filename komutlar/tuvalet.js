const moment = require("moment"); // Zaman formatlama için
moment.locale("tr"); // Türkçe için locale ayarı

module.exports = {
    name: "tuvalet",
    description: "Bir kullanıcının tuvalete ne zaman gittiğini tahmin eder.",
    execute(message, args) {
        // Etiketlenen kullanıcıyı kontrol et
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply("Lütfen bir kullanıcıyı etiketle! 🚽");
        }

        // Şu anki saatten geçmiş bir saat oluştur
        const now = moment();
        const randomHour = Math.floor(Math.random() * now.hours()); // 0 ile şu anki saat arasında rastgele bir saat
        const randomMinute = Math.floor(Math.random() * 60); // 0-59 arasında rastgele dakika
        const toiletTime = moment().set({ hour: randomHour, minute: randomMinute });

        // Eğlenceli mesaj oluştur
        const response = `${targetUser} şu zaman tuvalete gitmiş olabilir: **${toiletTime.format("HH:mm")}** 🚻💩`;

        // Yanıt gönder
        message.channel.send(response);
    },
};
