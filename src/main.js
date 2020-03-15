const {http, io} = require('./server');

const state = require('./state');

const port = 3000;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

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
