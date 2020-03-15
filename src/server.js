const mongoose = require('mongoose');
const app = require('./app');
const http = require('http').createServer(app);

const io = require('socket.io')(http);

const port = 3000;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

io.on('connection', function(socket) {
  console.log('yo');
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