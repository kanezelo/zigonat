module.exports = {
    name: 'çekiliş',
    description: 'Çekiliş yapmanızı sağlar',
    async execute(message, client) {
        const args = message.content.split(' ');

        const süre = parseInt(args[1]); // Çekiliş süresi saniye cinsinden
        const sebep = args.slice(2).join(' '); // Sebep, komut sonrası gelen tüm kelimeler

        if (!süre || isNaN(süre)) return message.reply('Geçerli bir süre girin (saniye cinsinden).');
        if (!sebep) return message.reply('Lütfen çekiliş sebebini belirtin!');

        let participants = []; // Katılımcıları depolamak için bir dizi
        const emoji = '🎉'; // Katılım için emoji

        // Çekiliş mesajını gönder
        const çekilişMesajı = await message.channel.send(`🎉 **Çekiliş Başladı!** 🎉\nKatılmak için ${emoji} emojisine tıklayın!\n**Sebep**: ${sebep}\nSüre: ${süre} saniye`);
        await çekilişMesajı.react(emoji); // Emoji ekle

        // Çekiliş süresi boyunca mesajı güncelle
        let zaman = süre;
        let mesajBulunamadı = false; // Mesaj bulunamadı durumunu kontrol etmek için bayrak
        const süreID = setInterval(async () => {
            if (zaman <= 0) {
                clearInterval(süreID); // Süre bitti, çekilişi sonlandır
                if (participants.length === 0) {
                    return message.channel.send('Çekilişe katılan kimse yok!');
                }

                // Kazananı seçme işlemi burada yapılır
                const winnerIndex = Math.floor(Math.random() * participants.length);
                const winnerId = participants[winnerIndex];

                try {
                    const winner = await client.users.fetch(winnerId);
                    try {
                        await winner.send(`Tebrikler! 🎉 Siz **${sebep}** çekilişini kazandınız!`);
                        message.channel.send(`${winner.tag} çekilişi kazandı! Sebep: ${sebep}`);
                    } catch (dmError) {
                        message.channel.send(`${winner.tag}'ın DM'i kapalı. Çekiliş sonuçlarını burada bilgilendiriyorum.`);
                    }
                } catch (error) {
                    message.channel.send('Kazananın bilgileri alınırken bir hata oluştu.');
                }
                return;
            }

            try {
                await çekilişMesajı.edit(`🎉 **Çekiliş Başladı!** 🎉\nKatılmak için ${emoji} emojisine tıklayın!\n**Sebep**: ${sebep}\nKalan süre: ${zaman} saniye`);
            } catch (editError) {
                if (editError.code === 10008 && !mesajBulunamadı) {
                    // Mesaj silindiği için sadece bir kez uyarı gönderiyoruz
                    mesajBulunamadı = true;
                    message.channel.send('Mesaj bulunamadı, mesaj kaybolmuş olabilir. Çekilişi sonuçlandıramıyorum.');

                    // Katılımcılara özür dile
                    if (participants.length > 0) {
                        message.channel.send(`Çekilişe katılanlar: <@${participants.join('>, <@')}>. Özür dilerim, çekilişi sonuçlandıramıyorum.`);
                    }

                    // Çekilişi sıfırla ve durdur
                    clearInterval(süreID); // Zamanlayıcıyı durdur
                    return; // Çekilişin sonlandırılması
                }
            }
            zaman--;
        }, 1000); // Her saniye bir kez güncelleme

        // Emojiye tıklayanları kaydet
        const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot && user.id !== client.user.id; // Botu dahil etme
        const collector = çekilişMesajı.createReactionCollector({ filter, time: süre * 1000 });

        collector.on('collect', (reaction, user) => {
            if (!participants.includes(user.id)) {
                participants.push(user.id);
            }
        });

        collector.on('end', () => {
            if (participants.length === 0) {
                message.channel.send('Çekilişe katılan kimse yok!');
            }
        });
    }
};
