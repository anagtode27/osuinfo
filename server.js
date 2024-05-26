// Import Express to handle server routing
import express from 'express';
const app = express(); // app is an instance of Express application
const port = 3000;

// Import Fetch to make API calls from server-side
import fetch from 'node-fetch';

// Import dotenv to hide API key (process.env.API_KEY)
import 'dotenv/config'; 

// Start server to listen on port
app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});

// Serve public directory to client
app.use(express.static("public"));

// Set up one endpoint
app.get('/get_user_data/:user', async (req, res) => {
    //console.log(req.params.user);
    const api_url = `https://osu.ppy.sh/api/get_user?k=${process.env.API_KEY}&u=${req.params.user}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    //console.log(data);
    res.json(data);
});

// Set up THE IMAGE ENDPOINT HERE
app.get('/get_user_pfp/:uid', async (req, res) => {
    //console.log(req.params.user);
    const api_url = `https://s.ppy.sh/a/${req.params.uid}`;
    //console.log(api_url);
    const fetch_response = await fetch(api_url);
    const data_buffer = await fetch_response.arrayBuffer();
    const data_b64 = Buffer.from(data_buffer).toString('base64');
    //console.log(data_b64);
    res.send(data_b64);
});

