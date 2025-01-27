const mongoose = require('mongoose');
const { MessageActionRow, MessageButton } = require('discord.js-selfbot-v13');

// Emojiler ve roller
const roller = {
  '🍓': '1331760902093013012', // Çilek
  '🍋': '1331760903225475124', // Limon
  '🍇': '1331760903716077717', // Üzüm
  '🥬': '1331760904781697106', // Ispanak
  '🍊': '1331760905528016918', // Portakal
};

// MongoDB şeması
const rolSecimSchema = new mongoose.Schema({
  channelId: String,
  messageId: String,
});

const RolSecim = mongoose.model('RolSecim', rolSecimSchema);

module.exports = {
  name: 'rolseçim',
  description: 'Belirtilen emojilere tıklayarak rollerini seçebilirsiniz.',
  async execute(message, client) {
    // MongoDB'den kanal bilgilerini al
    const rolSecimData = await RolSecim.findOne({ channelId: message.channel.id });

    let rolMesaj;

    if (rolSecimData) {
      try {
        // Eğer mesajı bulabiliyorsak, mesajı al
        rolMesaj = await message.channel.messages.fetch(rolSecimData.messageId);
        // Mesajı bulduğunda, "Bulundu!" şeklinde mesaj gönder
        const msg = await message.channel.send("🔍 Bulundu!");
        setTimeout(() => msg.delete(), 2000);

        // Tepki eklemeye devam et
        for (const emoji of Object.keys(roller)) {
          if (!rolMesaj.reactions.cache.has(emoji)) {
            await rolMesaj.react(emoji);
          }
        }
      } catch (error) {
        // Eğer mesaj bulunamazsa, yeni mesaj gönder
        console.log("Mesaj bulunamadı, yeni mesaj gönderiliyor...");
        rolMesaj = await message.channel.send(
          `Rol seçimi yapmak için aşağıdaki emojilere tıklayın:\n\n` +
          `🍓 - Çilek Rolü\n` +
          `🍋 - Limon Rolü\n` +
          `🍇 - Üzüm Rolü\n` +
          `🥬 - Ispanak Rolü\n` +
          `🍊 - Portakal Rolü\n`
        );

        // Mesajın ID'sini MongoDB'ye kaydet
        await RolSecim.create({ channelId: message.channel.id, messageId: rolMesaj.id });

        // Emojileri mesaja ekle
        for (const emoji of Object.keys(roller)) {
          await rolMesaj.react(emoji);
        }
      }
    } else {
      // Eğer kanal verisi bulunmazsa, yeni mesaj gönder
      console.log("Kanal kaydı bulunamadı, yeni mesaj gönderiliyor...");
      rolMesaj = await message.channel.send(
        `Rol seçimi yapmak için aşağıdaki emojilere tıklayın:\n\n` +
        `🍓 - Çilek Rolü\n` +
        `🍋 - Limon Rolü\n` +
        `🍇 - Üzüm Rolü\n` +
        `🥬 - Ispanak Rolü\n` +
        `🍊 - Portakal Rolü\n`
      );

      // Mesajın ID'sini MongoDB'ye kaydet
      await RolSecim.create({ channelId: message.channel.id, messageId: rolMesaj.id });

      // Emojileri mesaja ekle
      for (const emoji of Object.keys(roller)) {
        await rolMesaj.react(emoji);
      }
    }

    // Tepki dinleyici
    const filter = (reaction, user) => Object.keys(roller).includes(reaction.emoji.name);
    const collector = rolMesaj.createReactionCollector({ filter, dispose: true });

    collector.on('collect', async (reaction, user) => {
      const roleID = roller[reaction.emoji.name];
      const member = message.guild.members.cache.get(user.id);

      if (member.roles.cache.has(roleID)) return;

      try {
        await member.roles.add(roleID);
        const msg = await message.channel.send(`${user} ✅ **${reaction.emoji.name}** emojisine tıkladınız. Rolünüz başarıyla verildi!`);
        setTimeout(() => msg.delete(), 2000);
      } catch (error) {
        console.error(error);
        const msg = await message.channel.send(`${user} ❌ Rol eklenirken bir hata oluştu.`);
        setTimeout(() => msg.delete(), 2000);
      }
    });

    collector.on('remove', async (reaction, user) => {
      const roleID = roller[reaction.emoji.name];
      const member = message.guild.members.cache.get(user.id);

      if (!member.roles.cache.has(roleID)) return;

      try {
        await member.roles.remove(roleID);
        const msg = await message.channel.send(`${user} ❌ **${reaction.emoji.name}** emojisini kaldırdınız. Rolünüz geri alındı!`);
        setTimeout(() => msg.delete(), 2000);
      } catch (error) {
        console.error(error);
        const msg = await message.channel.send(`${user} ❌ Rol kaldırılırken bir hata oluştu.`);
        setTimeout(() => msg.delete(), 2000);
      }
    });
  },
};
