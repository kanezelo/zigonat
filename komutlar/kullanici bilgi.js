const moment = require('moment');

module.exports = {
  name: 'kullanıcı bilgi', // Komut ismi Türkçe karakterle
  description: 'Belirtilen kullanıcının bilgilerini gösterir. Kullanıcı adı, ID, hesap oluşturma tarihi, sunucuya katılma tarihi, sıralama ve rolleri hakkında bilgi verir.',
  execute: async (message, client) => {
    try {
      let csm;
      const args = message.content.split(' ').slice(1); // Komut sonrasındaki argümanlar

      if (args.length === 0) {
        // Eğer kullanıcı belirtilmemişse, komut gönderen kullanıcıya uyarı mesajı gönder
        return message.channel.send("Lütfen bir kullanıcı ID'si veya etiketini belirtin.");
      }

      // Eğer kullanıcı etiketlenmişse veya ID verilmişse
      const mentionedUser = message.mentions.members.first();
      if (mentionedUser) {
        csm = mentionedUser;
      } else {
        // ID olarak bir kullanıcı verilmişse
        const userId = args[0];
        csm = message.guild.members.cache.get(userId);
        
        if (!csm) {
          return message.channel.send("Geçerli bir kullanıcı ID'si bulunamadı.");
        }
      }

      const a = "`"; // Kullanıcı adı ve ID'yi koyduğumuz format
      let csd = message.guild.members.cache.filter(mr => mr.joinedTimestamp < csm.joinedTimestamp).size + 1; // Sunucuya katılan sıralaması

      // Kullanıcının sadece @everyone rolüne sahip olup olmadığını kontrol ediyoruz
      const userRoles = csm.roles.cache.filter(role => role.id !== message.guild.id); // @everyone rolünü çıkarıyoruz

      // Eğer @everyone dışında başka bir rol varsa, rol sayısını gösteriyoruz
      const roleCount = userRoles.size > 0 ? userRoles.size : 'Hiç rolü yok';

      // Kullanıcı bilgilerini düz metin formatında oluşturuyoruz
      let userInfo = `
Kullanıcı Adı: ${a}${csm.user.username}${a}
Kullanıcı ID: ${a}${csm.user.id}${a}
Hesap Oluşturma Tarihi: ${a}${moment(csm.user.createdTimestamp).format('LLLL')}${a}
Sunucuya Girme Tarihi: ${a}${moment(csm.joinedTimestamp).format('LLLL')}${a}
Sunucuya Katılan Sıralama: ${a}${csd}${a}
Rolleri: ${a}${roleCount}${a}
${userRoles.size > 0 ? `${a}${userRoles.map(role => role.name).join(", ")}${a}` : ""}
      `;

      // Kullanıcı bilgilerini mesaj olarak gönderiyoruz
      await message.channel.send(userInfo);

    } catch (error) {
      console.error(error); // Hata logu
      message.channel.send('Bir hata oluştu! Lütfen tekrar deneyin.');
    }
  }
};
