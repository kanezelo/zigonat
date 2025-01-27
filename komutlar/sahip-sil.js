const { Sahip } = require('../index.js');

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