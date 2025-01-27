module.exports = {
    name: 'otorol',
    description: 'Sunucuda otomatik olarak 15 farklı rol oluşturur ve aralarına ayırıcı ekler.',
    async execute(message, args) {
        if (!message.guild) return message.reply('Bu komut sadece sunucularda kullanılabilir.');
        
        const renkliRoller = [
            { isim: '🍓 Çilek', renk: '#FF0000' },
            { isim: '🍋 Limon', renk: '#FFFF00' },
            { isim: '🍇 Üzüm', renk: '#800080' },
            { isim: '🥬 Marul', renk: '#228B22' },
            { isim: '🍊 Portakal', renk: '#FFA500' }
        ];

        const havalıRoller = ['Zeus', 'Poseidon', 'Hades', 'Apollo', 'Athena'];
        const adminRoller = ['Moderatör', 'Yönetici Yardımcısı', 'Koordinatör', 'Baş Yönetici', 'Sistem Yöneticisi'];

        try {
            // Ayırıcı rol
            await message.guild.roles.create({
                name: '--------------------------',
                color: '#2F3136',
                permissions: []
            });

            // Renkli roller
            for (const rol of renkliRoller) {
                await message.guild.roles.create({
                    name: rol.isim,
                    color: rol.renk,
                    permissions: []
                });
            }

            // Ayırıcı rol
            await message.guild.roles.create({
                name: '--------------------------',
                color: '#2F3136',
                permissions: []
            });

            // Havalı roller
            for (const isim of havalıRoller) {
                await message.guild.roles.create({
                    name: isim,
                    color: null,
                    permissions: []
                });
            }

            // Ayırıcı rol
            await message.guild.roles.create({
                name: '--------------------------',
                color: '#2F3136',
                permissions: []
            });

            // Admin roller
            for (const [index, isim] of adminRoller.entries()) {
                await message.guild.roles.create({
                    name: isim,
                    color: null,
                    permissions: index === adminRoller.length - 1 ? ['ADMINISTRATOR'] : ['MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                });
            }

            message.reply('Roller başarıyla oluşturuldu!');
        } catch (error) {
            console.error(error);
            message.reply('Roller oluşturulurken bir hata meydana geldi.');
        }
    },
};
