module.exports = {
  name: 'tkm',
  description: 'Taş Kağıt Makas oyunu oynayın.',
  async execute(message, client) {
    // Kullanıcıdan etiket al
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Lütfen bir kullanıcı etiketleyin. Örnek: `.tkm @kullanıcı`');
    }

    const player1 = message.author;
    const player2 = user;

    const choices = ['taş', 'kağıt', 'makas'];

    // Oyun başlamadan önce her iki oyuncuya da "bekleniyor" mesajı gönder
    message.channel.send(`${player2.username}, ${player1.username} seçim yapıyor. Bekleniyor...`);

    // Kullanıcı seçimlerini al
    async function getChoice(player, otherPlayer) {
      try {
        const dm = await player.createDM();
        await dm.send('Taş, Kağıt veya Makas seçin. (Mesajınızı buraya yazın)');
        const filter = (response) =>
          response.author.id === player.id &&
          choices.includes(response.content.toLowerCase());
        const collected = await dm.awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ['time'],
        });

        // Seçimi kaydet
        const choice = collected.first().content.toLowerCase();
        message.channel.send(`${player.username} seçimini yaptı `);

        return choice;
      } catch (error) {
        // Eğer DM gönderilemiyorsa, DM açılmasa da doğrudan kanal üzerinden ileti gönder
        message.channel.send(`${player.username}, DM kanalı kapalı olduğu için seçim yapamadı. Lütfen DM kanalınızı açın.`);
        return null;
      }
    }

    // Seçimleri al
    const player1Choice = await getChoice(player1, player2);
    if (!player1Choice) {
      return message.reply(`${player1.username} seçim yapmadı, oyun iptal edildi.`);
    }

    const player2Choice = await getChoice(player2, player1);
    if (!player2Choice) {
      return message.reply(`${player2.username} seçim yapmadı, oyun iptal edildi.`);
    }

    // Kazananı belirle
    let result = '';
    if (player1Choice === player2Choice) {
      result = 'Berabere!';
    } else if (
      (player1Choice === 'taş' && player2Choice === 'makas') ||
      (player1Choice === 'kağıt' && player2Choice === 'taş') ||
      (player1Choice === 'makas' && player2Choice === 'kağıt')
    ) {
      result = `${player1.username} kazandı! (${player1Choice} vs ${player2Choice})`;
    } else {
      result = `${player2.username} kazandı! (${player2Choice} vs ${player1Choice})`;
    }

    // Sonuçları ve seçimleri komutun yazıldığı kanalda göster
    message.channel.send(`
**Oyun Sonucu:**
- ${player1.username} seçimi: **${player1Choice}**
- ${player2.username} seçimi: **${player2Choice}**

${result}
    `);
  }
};
