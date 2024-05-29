// Import Express to handle server routing
import express from 'express';
const app = express(); // app is an instance of Express application
const port = process.env.PORT || 3000;

// Import Fetch to make API calls from server-side
import fetch from 'node-fetch';

// Import dotenv to hide API key (process.env.API_KEY)
import 'dotenv/config'; 

// Start server to listen on port
app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});

// Serve public directory to client
app.use(express.static("assets"));

// User data endpoint
app.get('/get_user_data/:user', async (req, res) => {
    const api_url = `https://osu.ppy.sh/api/get_user?k=${process.env.API_KEY}&u=${req.params.user}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    res.json(data);
});

// Profile picture endpoint
app.get('/get_user_pfp/:uid', async (req, res) => {
    const api_url = `https://s.ppy.sh/a/${req.params.uid}`;
    const fetch_response = await fetch(api_url);
    const data_buffer = await fetch_response.arrayBuffer();
    const data_b64 = Buffer.from(data_buffer).toString('base64');
    res.send(data_b64);
});

// Recent scores endpoint
app.get('/get_user_recent/:user', async (req, res) => {
    const api_url = `https://osu.ppy.sh/api/get_user_recent?k=${process.env.API_KEY}&u=${req.params.user}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    res.json(data);
});

// Beatmap endpoint
app.get('/get_beatmaps/:id', async (req, res) => {
    const api_url = `https://osu.ppy.sh/api/get_beatmaps?k=${process.env.API_KEY}&b=${req.params.id}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    res.json(data);
});

// Beatmap cover endpoint
app.get('/get_cover_img/:id', async (req, res) => {
    const api_url = `https://assets.ppy.sh/beatmaps/${req.params.id}/covers/cover.jpg`;
    const fetch_response = await fetch(api_url);
    const data_buffer = await fetch_response.arrayBuffer();
    const data_b64 = Buffer.from(data_buffer).toString('base64');
    res.send(data_b64);
});

// Beatmap thumbnail endpoint
app.get('/get_thumbnail_img/:id', async (req, res) => {
    const api_url = `https://b.ppy.sh/thumb/${req.params.id}l.jpg`;
    const fetch_response = await fetch(api_url);
    const data_buffer = await fetch_response.arrayBuffer();
    const data_b64 = Buffer.from(data_buffer).toString('base64');
    res.send(data_b64);
});

app.get('/get_user_best/:user', async (req, res) => {
    const api_url = `https://osu.ppy.sh/api/get_user_best?k=${process.env.API_KEY}&u=${req.params.user}`;
    const fetch_response = await fetch(api_url);
    const play_data = await fetch_response.json();

    // Assuming 'data' is an array of best plays, we need to iterate over it correctly
    const beatmapsPromises = play_data.map(async (play) => {
        const beatmapApiUrl = `https://osu.ppy.sh/api/get_beatmaps?k=${process.env.API_KEY}&b=${play.beatmap_id}`;
        const beatmapResponse = await fetch(beatmapApiUrl);
        return beatmapResponse.json(); // This will be a promise
    });

    // Wait for all the beatmap information to be fetched
    const beatmap_info = await Promise.all(beatmapsPromises);
    const compiledInfo = [play_data, beatmap_info]
    res.json(compiledInfo);
});
