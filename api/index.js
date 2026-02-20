const express = require('express');
const { META } = require('@consumet/extensions');
const app = express();
const anilist = new META.Anilist();

app.get('/search/:query', async (req, res) => {
    try {
        const results = await anilist.search(req.params.query);
        res.json(results);
    } catch (err) { res.status(500).json({ error: "Search failed" }); }
});

app.get('/info/:id', async (req, res) => {
    try {
        // This is the key: fetchAnimeInfo needs to actually find the episode mapping
        const data = await anilist.fetchAnimeInfo(req.params.id);
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Failed to fetch episodes" }); }
});

app.get('/watch/:id(*)', async (req, res) => {
    try {
        const data = await anilist.fetchEpisodeSources(req.params.id);
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Source not found" }); }
});

app.listen(3000);
