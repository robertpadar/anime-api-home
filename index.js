const express = require('express');
const { META } = require('@consumet/extensions');
const app = express();
const anilist = new META.Anilist();

app.get('/watch/:id', async (req, res) => {
    try {
        const episodeId = req.params.id;
        const data = await anilist.fetchEpisodeSources(episodeId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sources" });
    }
});

app.get('/info/:id', async (req, res) => {
    try {
        const data = await anilist.fetchAnimeInfo(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch info" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));