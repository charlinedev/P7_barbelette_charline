const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Security & data
app.use(helmet());
app.use(cors());
app.options('*', cors());

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);


module.exports = app;