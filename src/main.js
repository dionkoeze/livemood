const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/:label', function(req, res) {
    if (req.body.secret === process.env.SECRET) {
        state.deleteLabel(req.params.label);
        res.status(200).end();
    } else {
        res.status(401).end();
    }
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('*', function(_, res) {
    res.status(404).send('<h3>Whoops... You seem to have found a 404!</h3>');
});

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const state = require('./state')(io);

const port = 3000;

io.on('connection', function(socket) {
    socket.on('vote', function(vote) {
        state.vote(socket.id, vote);
    });

    state.sendUserCount();
    state.send(socket);
});

io.on('disconnect', function(_) {
    state.sendUserCount();
});

http.listen(process.env.PORT || port);
