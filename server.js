// Import Express to handle routing
import express from 'express';
const app = express(); // app is an instance of Express application
const port = 3000;

// Import Fetch to make API calls from server-side
import fetch from 'node-fetch';

// Import dotenv to hide API key (process.env.API_KEY)
import 'dotenv/config'; 

// Start server to listen 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Serve public directory 
app.use(express.static("public"));

// Set up one endpoint
app.get('/get_user_data/:user', async (req, res) => {
    console.log(req.params.user);
    const api_url = `https://osu.ppy.sh/api/get_user?k=${process.env.API_KEY}&u=${req.params.user}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    console.log(data);
    res.json(data);
});


