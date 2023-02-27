const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { handleErrors } = require('./helpers/handleErrors');
require('dotenv').config();

//App
const app = express();

dbConnection();

app.listen( process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});

app.use(express.static('public'));

app.use(express.json());

app.use(cors());



// Routes

app.use('/api/auth', require('./routes/authRoute'));

app.use('/api/projects', require('./routes/projectsRoutes'));

app.use('/api/bugs', require('./routes/bugRoutes'));

app.use('/api/comments', require('./routes/commentsRoutes'));

app.use(handleErrors);