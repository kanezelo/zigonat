// "kelimeOyunu.js" - Rastgele Harf ile Kelime Bulma Oyunu

const mongoose = require("mongoose");
const harfler = "abcçdefgğhıijklmnoöprsştuüvyz"; // Türkçe alfabesi
const axios = require("axios"); // API çağrısı için axios kullanıyoruz

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
      // Duplicate key hatası, kelime zaten mevcut
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

    message.reply(`Rastgele seçilen harf: \`${rastgeleHarf}\`. Bu harfle başlayan bir kelime yazmak için 15 saniyen var!`);

    const filter = (m) => m.content.toLowerCase().startsWith(rastgeleHarf);
    const collector = message.channel.createMessageCollector({ filter, time: 15000 }); // 15 saniye süre tanıyoruz.

    collector.on("collect", async (msg) => {
      const kelime = msg.content.toLowerCase();

      if (await kelimeKontrol(kelime)) {
        return msg.reply("Bu kelime zaten kullanıldı! Başka bir kelime dene.");
      }

      try {
        // Kelimenin geçerliliğini kontrol etmek için API çağrısı yapıyoruz (örnek bir API kullanılıyor)
        const response = await axios.get(`https://sozluk.gov.tr/gts?ara=${encodeURIComponent(kelime)}`);

        if (response.data[0]?.madde) {
          await kelimeEkle(kelime); // Kelimeyi veritabanına kaydediyoruz
          msg.reply(`\`${kelime}\` kelimesi kabul edildi! Tebrikler!`);
          collector.stop(); // Doğru bir cevap geldiği için süreyi durduruyoruz.
        } else {
          msg.reply(`\`${kelime}\` kelimesi bulunamadı! Lütfen geçerli bir kelime gir.`);
        }
      } catch (error) {
        msg.reply("Bir hata oluştu veya kelime doğrulanamadı. Lütfen tekrar deneyin.");
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason !== "user") {
        message.reply("Süre doldu! Maalesef kelime bulunamadı.");
      }
    });
  },
};
