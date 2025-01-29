const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'komutlar',
    description: 'Tüm komutların listesini gösterir.',
    execute(message, client) {
        const komutlarPath = path.join(__dirname, '../komutlar');

        fs.readdir(komutlarPath, (err, files) => {
            if (err) {
                console.error(err);
                return message.channel.send('Komutlar yüklenirken bir hata oluştu.');
            }

            const jsFiles = files.filter(file => file.endsWith('.js'));

            if (jsFiles.length === 0) {
                return message.channel.send('Komutlar bulunamadı.');
            }

            // Komutları sıralayarak ve kod bloğu formatında hazırlıyoruz
            const komutlarListesi = jsFiles
                .map((file, index) => {
                    const komut = require(path.join(komutlarPath, file));
                    const name = komut.name || 'Bilinmeyen';
                    const description = komut.description || 'Açıklama yok.';
                    return `${index + 1}. **${name}**: \`${description}\``;
                })
                .join('\n');

            // Sonucu mesaj olarak gönderiyoruz
            message.channel.send(`**Komutlar Listesi:**\n\n${komutlarListesi}`);
        });
    }
};
