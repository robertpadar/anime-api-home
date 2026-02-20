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
        // Change: We add a provider parameter to ensure we get episodes
        const data = await anilist.fetchAnimeInfo(req.params.id); 
        
        // If episodes are still empty, try forcing the 'zoro' provider
        if (!data.episodes || data.episodes.length === 0) {
            const zoroData = await anilist.fetchAnimeInfo(req.params.id, "zoro");
            return res.json(zoroData);
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch episodes" });
    }
});

// WATCH: Gets the final .m3u8 video link
// The (*) tells Express to capture the full ID even if it has symbols like $
app.get('/watch/:id(*)', async (req, res) => {
    try {
        // This will now correctly handle IDs like 'one-piece-100$episode$2142'
        const data = await anilist.fetchEpisodeSources(req.params.id);
        res.json(data);
    } catch (err) {
        // Provides a clear error if the source is truly missing
        res.status(500).json({ error: "Source not found", details: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API is active`));
