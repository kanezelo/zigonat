module.exports = {
  name: 'beden',
  description: 'Bir kullanıcıya rastgele bir sütyen bedeni atar.',
  execute: async (message, client) => {
    const bedenListesi = [
      '70A',
      '70B',
      '70C',
      '75A',
      '75B',
      '75C',
      '80A',
      '80B',
      '80C',
      '85A',
      '85B',
      '85C',
      '90A',
      '90B',
      '90C',
      '95A',
      '95B',
      '95C',
      '100A',
      '100B',
      '100C',
    ];

    const etiketlenenKisi = message.mentions.users.first();
    if (!etiketlenenKisi) {
      return message.reply('Lütfen bir kullanıcı etiketleyin! Örnek: `.cm @kullanıcı`');
    }

    const rastgeleBeden = bedenListesi[Math.floor(Math.random() * bedenListesi.length)];

    message.channel.send(`<@${etiketlenenKisi.id}>'nin sütyen bedeni: **${rastgeleBeden}**`);
  }
};
