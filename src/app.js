const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use('*', function(_, res) {
    res.send('<h3>Whoops... You seem to have found a 404!</h3>');
});

module.exports = app;
