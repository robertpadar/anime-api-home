const express = require('express');
const { META } = require('@consumet/extensions');
const app = express();
const anilist = new META.Anilist();

app.get('/search/:query', async (req, res) => {
    try {
        const results = await anilist.search(req.params.query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

app.get('/info/:id', async (req, res) => {
    try {
        // FETCH EPISODES: This is the critical fix for "No Episodes"
        const data = await anilist.fetchAnimeInfo(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch info" });
    }
});

app.get('/watch/:id', async (req, res) => {
    try {
        // This gets the actual .m3u8 video link
        const data = await anilist.fetchEpisodeSources(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sources" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running`));
