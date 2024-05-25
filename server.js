// Import Express to handle routing
const express = require("express");
const app = express();

// Import dotenv to hide API key
require('dotenv').config()
// api key will be process.env.API_KEY

const port = 3000;



app.get('/', (req, res) => {
  res.send("Hellsdadsadasd!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});