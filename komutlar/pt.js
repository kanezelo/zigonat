const axios = require('axios');

module.exports = {
  name: 'pt',
  description: 'Verilen proxy listesini test eder ve her bir proxy\'nin çalışıp çalışmadığını bildirir.',
  execute: async (message, client) => {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.channel.send('Lütfen proxy listesini giriniz! (Örnek: `!proxytest proxy1,proxy2,proxy3`)');
    }

    const proxyList = args.join(' ');
    const proxyArray = proxyList.split(',');

    if (proxyArray.length === 0) {
      return message.channel.send('Lütfen en az bir proxy giriniz!');
    }

    const testResults = [];
    message.channel.send('Proxy testi başlıyor...');

    for (const proxy of proxyArray) {
      const proxyUrl = `http://${proxy.trim()}`;
      try {
        const response = await axios.get(proxyUrl);
        if (response.status === 200) {
          testResults.push(`${proxy} - **ÇALIŞIYOR**`);
        } else {
          testResults.push(`${proxy} - **ÇALIŞMIYOR**`);
        }
      } catch (error) {
        testResults.push(`${proxy} - **ÇALIŞMIYOR**`);
      }
    }

    const testResultsMessage = testResults.join('\n');
    message.channel.send(`Proxy Test Sonuçları:\n${testResultsMessage}`);
  }
};
