const özelAralıklar = {
  // Kullanıcı ID'si: [minimum, maksimum]
  "125523416093687808": [20, 40], 
};

module.exports = {
  name: 'cm', // Komutun adı
  description: 'Bir kullanıcıya rastgele bir malafaat uzunluğu atar.',
  async execute(message, client, args) {
    const mentionedUser = message.mentions.users.first(); // Etiketlenen kullanıcıyı al

    if (!mentionedUser) {
      return message.reply('Lütfen bir kullanıcı etiketleyin! Örnek: `.cm @kullanıcı`');
    }

    const userId = mentionedUser.id; // Kullanıcının ID'sini al
    let malafatUzunluk;

    if (özelAralıklar[userId]) {
      // Kullanıcı özel listede varsa, belirlenen aralıkta rastgele bir sayı seç
      const [min, max] = özelAralıklar[userId];
      malafatUzunluk = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      // Kullanıcı özel listede yoksa rastgele bir uzunluk üret (-3 ile 30 arasında)
      malafatUzunluk = Math.floor(Math.random() * 34) - 3;
    }

    // Cevap ver
    return message.reply(
      `${mentionedUser.username} adlı kişinin malafatı: **${malafatUzunluk} cm**! 😂`
    );
  },
};
