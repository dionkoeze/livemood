const mongoose = require('mongoose');
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

mongoose.connect('mongodb://localhost:27017/polled', mongooseOptions)
.then(() => {
    console.log('Mongo connection established');
})
.catch((err) => {
    console.log(`Mongo connection FAILED!: ${err}`);
})
.then(() => {
    return http.listen(port);
})
.then(() => {
    console.log(`Server listening on port ${port}`);
})
.catch((err) => {
    console.log(`Server NOT LISTENING!: ${err}`);
});