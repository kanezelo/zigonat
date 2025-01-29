const axios = require('axios');

module.exports = {
    name: "film",
    description: "Rastgele bir film önerir.",
    async execute(message, args) {
        const apiKey = '030bec3a0cbd07ecad4b58b52bbb55ff'; // Senin TMDB API Key'in
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=tr-TR&page=1`;

        try {
            const response = await axios.get(url);
            const movies = response.data.results;

            if (movies && movies.length > 0) {
                const randomIndex = Math.floor(Math.random() * movies.length);
                const movie = movies[randomIndex];

                message.channel.send(`🎬 **Film Önerisi:** ${movie.title} (${movie.release_date.split('-')[0]})\n⭐ Puan: ${movie.vote_average}/10\n`);
            } else {
                message.channel.send("Film önerisi bulunamadı, lütfen tekrar deneyin!");
            }
        } catch (error) {
            console.error("API Hatası:", error);
            message.channel.send("Film önerisi alırken bir hata oluştu.");
        }
    }
};
