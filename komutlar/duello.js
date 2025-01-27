const { Client } = require('discord.js-selfbot-v13');
let activeDuels = {}; // Aktif düelloları tutacak nesne

module.exports = {
    name: 'duello',
    description: 'Bir rakip ile düello başlatır.',
    async execute(message) {
        const opponent = message.mentions.users.first();
        if (!opponent) {
            return message.reply('Bir rakip belirtmelisin!');
        }

        // Kendi kendine düello yapma engellemesi
        if (opponent.id === message.author.id) {
            return message.reply('Kendinle düello yapamazsın!');
        }

        // Botun kendisiyle düello yapılmasını engelleme
        if (opponent.bot) {
            return message.reply('Botlarla düello yapılamaz!');
        }

        // Aynı anda bir kanalda yalnızca bir düello yapılabilir
        if (activeDuels[message.guild.id]) {
            return message.reply('Bu kanalda şu an başka bir düello devam ediyor!');
        }

        // Rakibe düello isteği gönder
        const duelMessage = await message.channel.send(`${opponent}, ${message.author.tag} sana düello teklif etti! Kabul etmek için ✅, reddetmek için ❌ emojilerine tıkla.`);

        // Emojilerle yanıtları dinle
        await duelMessage.react('✅'); // Kabul et
        await duelMessage.react('❌'); // Reddet

        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === opponent.id;
        };

        const collector = duelMessage.createReactionCollector({ filter, time: 15000 });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === '✅') {
                activeDuels[message.guild.id] = { player1: message.author.id, player2: opponent.id }; // Aktif düelloyu kaydet
                await duelMessage.edit(`${message.author.tag} ile düello başlıyor!`);
                startDuel(message.author, opponent, message.channel);
            } else if (reaction.emoji.name === '❌') {
                await duelMessage.edit(`${message.author.tag} tarafından yapılan düello isteğini reddetti.`);
            }
        });

        collector.on('end', () => {
            if (!activeDuels[message.guild.id]) {
                duelMessage.edit('Düello isteği süresi doldu.');
            }
        });
    }
};

async function startDuel(player1, player2, channel) {
    let player1Health = 500;
    let player2Health = 500;

    let turn = player1.id; // İlk hamleyi player1 yapacak
    const moves = ['saldır', 'ultra güç', 'savun', 'kaç']; // Hamle seçenekleri

    let duelMessage = await channel.send(`
        **${player1.tag}** ile **${player2.tag}** duelloya girdiniz! Hamle yapmaya başlamak için sıradaki oyuncu **${player1.tag}**...
        **Düello Başlıyor!**
        **${player1.tag}:** ${player1Health} HP | **${player2.tag}:** ${player2Health} HP

        **Sıradaki hamle için:**
        🗡️ **Saldır**
        ⚡ **Ultra Güç**
        🛡️ **Savun**
        🏃‍♂️ **Kaç**
        **Şimdi sıra: @${turn === player1.id ? player1.username : player2.username}**
    `);

    // Zaman aşımını 30 saniye olarak ayarla
    const filter = (message) => moves.includes(message.content.toLowerCase());
    const collector = channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async (message) => {
        if (message.author.id === turn) {
            const action = message.content.toLowerCase();

            let damage = 0;

            // Rastgele bir hamle
            switch (action) {
                case 'saldır':
                    damage = Math.floor(Math.random() * 50) + 10; // 10-50 arasında rastgele hasar
                    if (turn === player1.id) {
                        player2Health -= damage;
                        message.reply(`${player2.tag}‘e ${damage} hasar verdiniz! Kalan sağlık: ${player2Health}`);
                    } else {
                        player1Health -= damage;
                        message.reply(`${player1.tag}‘a ${damage} hasar verdiniz! Kalan sağlık: ${player1Health}`);
                    }
                    break;
                case 'savun':
                    damage = Math.floor(Math.random() * 20) + 5; // Savunma, rakipten gelen hasarı azaltır
                    message.reply(`${message.author.tag} savunma yaptı! Hasar azaltıldı.`);
                    break;
                case 'ultra güç':
                    if (Math.random() > 0.5) { // Başarı şansı %50
                        damage = Math.floor(Math.random() * 100) + 30; // Ultra güç yüksek hasar verir
                        if (turn === player1.id) {
                            player2Health -= damage;
                            message.reply(`${player2.tag}‘e ultra güçle ${damage} hasar verdiniz! Kalan sağlık: ${player2Health}`);
                        } else {
                            player1Health -= damage;
                            message.reply(`${player1.tag}‘a ultra güçle ${damage} hasar verdiniz! Kalan sağlık: ${player1Health}`);
                        }
                    } else {
                        message.reply(`${message.author.tag} ultra güç kullanmaya çalıştı, ancak başarısız oldu!`);
                    }
                    break;
                case 'kaç':
                    message.reply(`${message.author.tag} düelloyu terk etti!`);
                    if (turn === player1.id) {
                        player2Health = 0; // Player 2 kazanır
                    } else {
                        player1Health = 0; // Player 1 kazanır
                    }
                    break;
            }

            // Her iki oyuncu da ölürse oyun biter
            if (player1Health <= 0) {
                message.channel.send(`${player1.tag} kaybetti! ${player2.tag} kazandı!`);
                collector.stop();
            } else if (player2Health <= 0) {
                message.channel.send(`${player2.tag} kaybetti! ${player1.tag} kazandı!`);
                collector.stop();
            }

            // Hamleyi bitiren oyuncunun sırası
            turn = turn === player1.id ? player2.id : player1.id;

            // Can bilgilerini güncelle ve mesajı tekrar gönder
            duelMessage = await channel.send(`
                **${player1.tag}:** ${player1Health} HP | **${player2.tag}:** ${player2Health} HP

                **Sıradaki hamle için:**
                🗡️ **Saldır**
                ⚡ **Ultra Güç**
                🛡️ **Savun**
                🏃‍♂️ **Kaç**

                **Şimdi sıra: @${turn === player1.id ? player1.username : player2.username}**
            `);
        }
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'time') {
            message.channel.send('Zaman doldu! Oyun sona erdi, bir oyuncu yanıt vermedi.');
            return;
        }
    });
}
