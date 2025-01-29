module.exports = {
  name: "arkadas",
  description: "Arkadaşlık derecesini ölçer!",
  async execute(message) {
    const mentionedUsers = message.mentions.users.map((user) => user.username);
    if (mentionedUsers.length === 0) {
      const arkadaslikSkoru = Math.floor(Math.random() * 101); // 0-100 arasında rastgele sayı
      return message.reply(`Arkadaşlık Skorunuz: **%${arkadaslikSkoru}**! 💙`);
    } else if (mentionedUsers.length === 1) {
      const arkadaslikSkoru = Math.floor(Math.random() * 101);
      return message.reply(
        `🤝 **${message.author.username}** ile **${mentionedUsers[0]}** arasındaki arkadaşlık skoru: **%${arkadaslikSkoru}**! 💙`
      );
    } else if (mentionedUsers.length === 2) {
      const arkadaslikSkoru = Math.floor(Math.random() * 101);
      return message.reply(
        `🤝 **${mentionedUsers[0]}** ile **${mentionedUsers[1]}** arasındaki arkadaşlık skoru: **%${arkadaslikSkoru}**! 💙`
      );
    } else {
      return message.reply("⚠️ Lütfen en fazla 2 kişiyi etiketleyin!");
    }
  },
};
