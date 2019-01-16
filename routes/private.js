const express = require('express');
const clients = require('../clients');
const app = express();

app.get('/index', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
});

module.exports = app;
