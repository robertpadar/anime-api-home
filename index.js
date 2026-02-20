const express = require('express');
const { META } = require('@consumet/extensions');
const app = express();
const anilist = new META.Anilist();

// SEARCH: Working based on your feedback
app.get('/search/:query', async (req, res) => {
    try {
        const results = await anilist.search(req.params.query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// INFO: This must return episodes for watch.php to work
app.get('/info/:id', async (req, res) => {
    try {
        // This fetches the episode list from GogoAnime by default
        const data = await anilist.fetchAnimeInfo(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch episodes" });
    }
});

// WATCH: Gets the final .m3u8 video link
app.get('/watch/:id', async (req, res) => {
    try {
        const data = await anilist.fetchEpisodeSources(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Source not found" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API is active`));
