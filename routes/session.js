const express = require('express');
const app = express();

app.get('/user', (req, res) => {
    console.log(req.session);
    console.log(req.session.user);
    res.send({ user: req.session.user })
});

module.exports = app;
