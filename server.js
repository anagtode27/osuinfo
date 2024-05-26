// Import Express to handle routing
import express from 'express';
const app = express(); // app is an instance of Express application
const port = 3000;

// Import Fetch to make API calls
import fetch from 'node-fetch';

// Import dotenv to hide API key
import 'dotenv/config';
// api key will be process.env.API_KEY

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


app.get('/get_user_data', async (req, res) => {
    const user_api_url = `https://osu.ppy.sh/api/get_user?k=${process.env.API_KEY}&u=mrekk`;
    const user_fetch_response = await fetch(user_api_url);
    const user_data = await user_fetch_response.json();
    console.log(user_data);
    res.json(user_data);
});


