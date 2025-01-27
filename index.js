const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı!');
}).catch((error) => {
  console.error('MongoDB bağlantısı hatası:', error);
});

// Sahipler için schema
const sahipSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  sahip: Boolean
});

const Sahip = mongoose.model('Sahip', sahipSchema);

// Komutlar dizisi
const komutlar = [];
client.commands = [];

// Komutları yükleme
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  files.forEach((file) => {
    if (file.endsWith('.js')) {
      const komut = require(`./komutlar/${file}`);
      client.commands.push(komut);
    }
  });
});

// Bot hazır olduğunda
client.on('ready', () => {
  console.log('Bot hazır!');
});

// Mesaj alındığında
client.on('messageCreate', async (message) => {
  if (message.author.id === client.user.id) return;  // Botun kendi mesajlarını işleme
  const args = message.content.split(' ');

  // Komutları işleme
  client.commands.forEach((komutDosya) => {
    if (message.content.startsWith(`${config.prefix}${komutDosya.name}`)) {
      (async () => {
        const sahipDoc = await Sahip.findOne({ id: message.author.id });
        const sahipList = config.sahipler; // config.json'dan sahipler listesi
        if (sahipDoc || sahipList.includes(message.author.id)) { // Eğer sahipse
          komutDosya.execute(message, client);
        } else {
          return; // Sahip değilse komutu çalıştırma
        }
      })();
    }
  });
});

// Botu başlatma
client.login(config.token);
