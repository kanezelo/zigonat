const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();
const config = require('../config.json');

// Kelime listesi
const kelimeler = [
  'merhaba', 'dostluk', 'bilgisayar', 'yazılım', 'örnek', 'kelime', 'güzellik',
  'teknoloji', 'doğa', 'hayvanlar', 'eğitim', 'bilim', 'zeka', 'özgürlük',
  'başarı', 'umut', 'çocuklar', 'gelecek', 'kitap', 'düşünce', 'sistem',
  'araştırma', 'öğrenmek', 'çalışma', 'uygulama', 'proje', 'mutluluk', 'sevgi',
  'toplum', 'medeniyet', 'saygı', 'yardımseverlik', 'çözüm', 'adalet',
  'özgünlük', 'dürüstlük', 'dayanışma', 'hayal', 'ilham', 'yenilik', 'hikaye',
  'buluş', 'fikir', 'vizyon', 'hedef', 'planlama', 'strateji', 'liderlik',
  'motivasyon', 'zorluk', 'sorumluluk', 'başlangıç', 'katılım', 'paylaşım',
  'uzlaşma', 'süreç', 'kararlılık', 'yenilikçilik', 'özveri', 'değer',
  'özgüven', 'başkent', 'kültür', 'çevre', 'sanat', 'tarih', 'arkeoloji',
  'mimari', 'düşünce', 'doğruluk', 'erdem', 'bilgelik', 'akıl', 'mantık',
  'empati', 'hoşgörü', 'cesaret', 'bağımsızlık', 'özgürlük', 'değişim',
  'çalışkanlık', 'sadakat', 'ahlak', 'güven', 'barış', 'doğruluk', 'nezaket',
  'yardımlaşma', 'birlik', 'beraberlik', 'samimiyet', 'huzur', 'sağlık',
  'başarı', 'azim', 'inanç', 'sabır', 'kararlılık', 'ödül', 'takdir'
];

// Aktif oyunları takip etmek için bir obje
const aktifOyunlar = {};

// Oyun süresi (saniye)
const oyunSuresi = 15;

// Komut
module.exports = {
  name: 'yazkazan',
  description: 'Kelimeyi doğru yazan ilk kişi kazanır. Süre 15 saniyedir.',
  execute: async (message, client) => {
    // Aynı kanalda başka bir oyun olup olmadığını kontrol et
    if (aktifOyunlar[message.channel.id]) {
      return message.channel.send('Zaten aktif bir oyun var!');
    }

    // Rastgele bir kelime seç
    const kelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];

    // Oyunu başlat
    aktifOyunlar[message.channel.id] = true;
    message.channel.send(`**YAZ KAZAN!**\nKelime: **${kelime}**\nSüreniz: **${oyunSuresi} saniye**\nHızlı yazın ve kazanın!`);

    // Mesajları dinle
    const collector = message.channel.createMessageCollector((m) => m.author.id !== client.user.id, { time: oyunSuresi * 1000 });

    collector.on('collect', (m) => {
      if (m.content.toLowerCase() === kelime.toLowerCase()) {
        // Doğru yazan ilk kişi kazanan ilan edilir
        message.channel.send(`**TEBRİKLER!**\n<@${m.author.id}> **KAZANDI!**\n`);

        aktifOyunlar[message.channel.id] = false;
        collector.stop();
      }
    });

    collector.on('end', (collected) => {
      if (aktifOyunlar[message.channel.id]) {
        // Süre dolarsa, kimsenin kazanmadığı duyurulur
        message.channel.send('Süre doldu! Kazanan yok.');
        aktifOyunlar[message.channel.id] = false;
      }
    });
  }
};
