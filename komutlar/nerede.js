module.exports = {
    name: 'n',
    description: 'Etiketlenen veya ID girilen kullanıcının botun olduğu tüm sunucularda hangi ses kanalında olduğunu söyler.',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('Bir kullanıcı etiketle veya bir ID gir!');
        }

        // Kullanıcıyı al
        let userId;
        if (message.mentions.users.size > 0) {
            userId = message.mentions.users.first().id;
        } else {
            userId = args[0];
        }

        const results = [];

        // Botun bulunduğu tüm sunucuları kontrol et
        message.client.guilds.cache.forEach(guild => {
            const member = guild.members.cache.get(userId);
            if (member && member.voice.channel) {
                results.push(`- Sunucu: **${guild.name}**, Ses Kanalı: **${member.voice.channel.name}**`);
            }
        });

        if (results.length === 0) {
            return message.reply('Bu kullanıcı botun olduğu hiçbir sunucuda bir ses kanalında değil.');
        }

        // Sonuçları gönder
        const reply = `Kullanıcı şu anda aşağıdaki ses kanallarında:\n${results.join('\n')}`;
        message.reply(reply);
    },
};
