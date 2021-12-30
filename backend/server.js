const http = require('http');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});

server.listen(process.env.PORT || 3000);