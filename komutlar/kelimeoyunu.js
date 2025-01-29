const mongoose = require("mongoose");
const axios = require("axios"); // API çağrısı için axios kullanıyoruz
const { addCoins } = require("../util/coinManager"); // Coin sistemini dahil et

const harfler = "abcçdefghıijklmnoöprsştuüvyz"; // Türkçe alfabesi

// MongoDB bağlantısı (index.js'deki mevcut bağlantıyı kullanır)
const kelimeSchema = new mongoose.Schema({
  kelime: { type: String, unique: true },
});

const Kelime = mongoose.model("Kelime", kelimeSchema);

async function kelimeEkle(kelime) {
  try {
    const yeniKelime = new Kelime({ kelime });
    await yeniKelime.save(); // Kelimeyi veritabanına ekler
  } catch (error) {
    if (error.code === 11000) {
      console.log("Kelime zaten kullanılmış: ", kelime);
    } else {
      console.error("Kelime eklenirken hata oluştu: ", error);
    }
  }
}

async function kelimeKontrol(kelime) {
  const kelimeVarMi = await Kelime.findOne({ kelime }); // Kelimenin daha önce kullanılıp kullanılmadığını kontrol eder
  return !!kelimeVarMi;
}

module.exports = {
  name: "kelimeoyunu",
  description: "Bot rastgele bir harf seçer ve kullanıcılar o harfle başlayan bir kelime bulmaya çalışır!",
  async execute(message) {
    // Rastgele bir harf seçiyoruz
    const rastgeleHarf = harfler[Math.floor(Math.random() * harfler.length)];

    message.reply(`🎮 **Kelime Oyunu Başladı!**\n🔤 **Seçilen Harf:** \`${rastgeleHarf}\`\n⏳ **15 saniyen var, bu harfle başlayan bir kelime yaz!**`);

    const filter = (m) => m.content.toLowerCase().startsWith(rastgeleHarf);
    const collector = message.channel.createMessageCollector({ filter, time: 15000 }); // 15 saniye süre tanıyoruz.

    collector.on("collect", async (msg) => {
      const kelime = msg.content.toLowerCase();

      if (await kelimeKontrol(kelime)) {
        return msg.reply("⚠️ Bu kelime zaten kullanılmış! Başka bir kelime dene.");
      }

      try {
        // Kelimenin geçerliliğini kontrol etmek için TDK API çağrısı
        const response = await axios.get(`https://sozluk.gov.tr/gts?ara=${encodeURIComponent(kelime)}`);

        if (response.data[0]?.madde) {
          await kelimeEkle(kelime); // Kelimeyi veritabanına kaydediyoruz

          
          const kazanilanCoin = Math.floor(Math.random() * (25 - 15 + 1)) + 15; // Rastgele 5-15 coin


          // Kazanan kullanıcıya coin ekleme
          const yeniBakiye = await addCoins(msg.author.id, kazanilanCoin);

          msg.reply(`🎉 **TEBRİKLER!** \`${kelime}\` kelimesi kabul edildi! ✅\n🔹 **Kazandığın Coin:** ${kazanilanCoin} 🪙\n💰 **Yeni Bakiyen:** ${yeniBakiye} coin!`);
          collector.stop(); // Doğru bir cevap geldiği için süreyi durduruyoruz.
        } else {
          msg.reply(`❌ \`${kelime}\` kelimesi bulunamadı! Lütfen geçerli bir kelime gir.`);
        }
      } catch (error) {
        msg.reply("⚠️ Bir hata oluştu veya kelime doğrulanamadı. Lütfen tekrar deneyin.");
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason !== "user") {
        message.reply("⏳ **Süre doldu!** Maalesef kimse geçerli bir kelime bulamadı.");
      }
    });
  },
};
