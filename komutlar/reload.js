const { client, komutlar } = require('../index.js');
const fs = require('fs');

module.exports = {
  name: 'reload',
  execute: async (message, client) => {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.channel.send('Lütfen bir komut adı giriniz!');
    }

    const komutAdi = args[0];
    const komutDosya = komutlar.find((komut) => komut.name === komutAdi);
    if (!komutDosya) {
      return message.channel.send('Komut bulunamadı!');
    }

    delete require.cache[require.resolve(`./komutlar/${komutAdi}.js`)];
    const yeniKomutDosya = require(`./komutlar/${komutAdi}.js`);
    komutlar[komutlar.indexOf(komutDosya)] = yeniKomutDosya;
    message.channel.send(`Komut ${komutAdi} başarıyla reload edildi!`);
  }
};