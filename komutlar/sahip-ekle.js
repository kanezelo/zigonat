const { Sahip } = require('../index.js');

module.exports = {
  name: 'sahip-ekle',
  execute: async (message, client) => {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.channel.send('Lütfen bir kullanıcı ID giriniz!');
    }

    const sahipId = args[0];
    const sahip = message.guild.members.cache.get(sahipId);

    if (!sahip) {
      return message.channel.send('Kullanıcı bulunamadı!');
    }

    try {
      const sahipDoc = await Sahip.findOne({ id: sahipId });
      if (sahipDoc) {
        return message.channel.send('Kullanıcı zaten sahip!');
      }

      const yeniSahip = new Sahip({ id: sahipId, sahip: true });
      await yeniSahip.save();
      message.channel.send(`Kullanıcı ${sahip.tag} başarıyla sahip olarak eklendi!`);
    } catch (error) {
      console.error(error);
      message.channel.send('Bir hata oluştu!');
    }
  }
};

module.exports = {
  name: 'sahip-sil',
  execute: async (message, client) => {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.channel.send('Lütfen bir kullanıcı ID giriniz!');
    }

    const sahipId = args[0];
    try {
      const sahipDoc = await Sahip.findOneAndDelete({ id: sahipId });
      if (!sahipDoc) {
        return message.channel.send('Kullanıcı sahip değil!');
      }

      message.channel.send(`Kullanıcı ${sahipId} başarıyla sahip olarak silindi!`);
    } catch (error) {
      console.error(error);
      message.channel.send('Bir hata oluştu!');
    }
  }
};

module.exports = {
  name: 'sahip-liste',
  execute: async (message, client) => {
    try {
      const sahipDocs = await Sahip.find();
      const sahipListesi = sahipDocs.map((sahip) => sahip.id);
      message.channel.send(`Sahip liste: ${sahipListesi.join(', ')}`);
    } catch (error) {
      console.error(error);
      message.channel.send('Bir hata oluştu!');
    }
  }
};
