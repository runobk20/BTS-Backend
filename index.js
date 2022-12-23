const express = require('express');
require('dotenv').config();

//App
const app = express();

app.listen( process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});

app.use( express.static('public') );

// Routes

