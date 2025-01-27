const { Sahip } = require('../index.js');

module.exports = {
  name: 'sahip',
  description: 'Kullanıcıları sahip olarak ekler, sahipliklerini siler veya sahipleri görüntüler. Yalnızca yetkililer tarafından kullanılabilir.',
  execute: async (message, client) => {
    const args = message.content.split(' ').slice(1);

    if (args[0] === 'ekle') {
      // .sahip ekle komutu
      if (args.length === 1) {
        return message.channel.send('Lütfen bir kullanıcı ID veya @kullanıcı giriniz!');
      }

      const userArgs = args.slice(1); // Kullanıcıları alıyoruz

      for (const userArg of userArgs) {
        let sahipId;

        // Geçerli bir @kullanıcı etiketini kontrol et
        const mentionedUser = message.mentions.users.get(userArg.replace(/[<@!>]/g, ''));
        if (mentionedUser) {
          sahipId = mentionedUser.id;
        } else {
          // Eğer ID olarak geçerli bir formatta değilse, hata mesajı ver
          if (!/^\d+$/.test(userArg)) {
            return message.channel.send(`${userArg} geçerli bir kullanıcı ID'si veya @kullanıcı etiketi değil!`);
          }
          sahipId = userArg; // ID olarak kabul et
        }

        try {
          // Kullanıcıyı veritabanında arıyoruz
          const sahipDoc = await Sahip.findOne({ id: sahipId });
          if (sahipDoc) {
            message.channel.send(`Kullanıcı ${sahipId} zaten sahip!`);
          } else {
            const yeniSahip = new Sahip({ id: sahipId, sahip: true });
            await yeniSahip.save();
            const sahip = message.guild.members.cache.get(sahipId);
            message.channel.send(`Kullanıcı ${sahip ? sahip.user.tag : sahipId} başarıyla sahip olarak eklendi!`);
          }
        } catch (error) {
          console.error(error);
          message.channel.send('Bir hata oluştu!');
        }
      }
    }

    else if (args[0] === 'sil') {
      // .sahip sil komutu
      if (args.length === 1) {
        return message.channel.send('Lütfen bir kullanıcı ID veya @kullanıcı etiketleyiniz!');
      }

      const userArgs = args.slice(1); // Kullanıcıları alıyoruz

      for (const userArg of userArgs) {
        let sahipId;

        // Eğer kullanıcı etiketlendiyse, ID'yi al
        if (userArg.startsWith('<@') && userArg.endsWith('>')) {
          const userId = userArg.slice(2, -1); // <@ID> kısmını kesip ID'yi alıyoruz
          sahipId = userId;
        } else {
          // Eğer ID olarak geçerli bir formatta değilse, hata mesajı ver
          if (!/^\d+$/.test(userArg)) {
            return message.channel.send(`${userArg} geçerli bir kullanıcı ID'si veya @kullanıcı etiketi değil!`);
          }
          sahipId = userArg; // ID olarak kabul et
        }

        try {
          // Kullanıcıyı veritabanında sil
          const sahipDoc = await Sahip.findOneAndDelete({ id: sahipId });
          if (!sahipDoc) {
            message.channel.send(`Kullanıcı ${sahipId} sahip değil!`);
          } else {
            message.channel.send(`Kullanıcı ${sahipId} başarıyla sahip olarak silindi!`);
          }
        } catch (error) {
          console.error(error);
          message.channel.send('Bir hata oluştu!');
        }
      }
    }
    
    else if (args[0] === 'liste') {
      // .sahip liste komutu
      try {
        const sahipler = await Sahip.find({ sahip: true });

        if (sahipler.length === 0) {
          return message.channel.send('Hiç sahip bulunmamaktadır.');
        }

        const sahipListesi = sahipler.map(sahip => {
          return `${sahip.id} <@${sahip.id}>`;
        }).join('\n');

        message.channel.send(`Sahipler:\n${sahipListesi}`);
      } catch (error) {
        console.error(error);
        message.channel.send('Bir hata oluştu!');
      }
    }

    else {
      // Geçersiz komut durumunda hata mesajı
      return message.channel.send('Lütfen geçerli bir komut kullanın: `.sahip ekle <id/@kullanıcı>`, `.sahip sil <id/@kullanıcı>` veya `.sahip liste`');
    }
  }
};
