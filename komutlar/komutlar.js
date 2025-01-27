const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'komutlar',
    description: 'Tüm komutların listesini gösterir.',
    execute(message, client) {
        // Komutlar klasörünün yolunu belirliyoruz
        const komutlarPath = path.join(__dirname, '../komutlar');

        // Komut dosyalarını okuyoruz
        fs.readdir(komutlarPath, (err, files) => {
            if (err) {
                console.error(err);
                return message.channel.send('Komutlar yüklenirken bir hata oluştu.');
            }

            // Yalnızca .js uzantılı dosyaları alıyoruz
            const jsFiles = files.filter(file => file.endsWith('.js'));

            if (jsFiles.length === 0) {
                return message.channel.send('Komutlar bulunamadı.');
            }

            // Her bir komut dosyasının adını ve açıklamasını alıyoruz
            const komutlarListesi = jsFiles.map(file => {
                const komut = require(path.join(komutlarPath, file)); // Komut dosyasını yüklüyoruz
                return `**${komut.name}**: ${komut.description || 'Açıklama yok.'}`;
            }).join('\n');

            // Komutlar listesini gönderiyoruz
            message.channel.send(`Komutlar listesi:\n${komutlarListesi}`);
        });
    }
};
