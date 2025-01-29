module.exports = {
    name: 'ping',
    description: 'Botun gecikme süresini ölçer ve gösterir.',
    execute(message, client) {
        const startTime = Date.now(); // Mesajın gönderildiği zamanı kaydeder

        // İlk mesaj
        message.channel.send('Pingi ölçüyorum...').then(() => {
            const endTime = Date.now(); // Mesaj gönderildikten sonra zaman kaydı
            const ping = endTime - startTime; // Gecikmeyi hesapla

            // Yeni bir mesajla sonucu gönder
            message.channel.send(`🏓 Pong! Gecikme süresi: \`${ping}ms\``);
        }).catch(err => {
            console.error('Ping ölçülürken bir hata oluştu:', err);
            message.channel.send('Ping ölçülürken bir hata oluştu.');
        });
    }
};
