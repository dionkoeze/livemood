const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

module.exports = {
  http,
  io,
}