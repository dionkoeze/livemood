const app = require('./app');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const state = require('./state')(io);

// test
// state.create('testRoom', io.to('testRoom'));

// io.origins('*:*');

function roomsWithParticipants() {
    return state.list().map(room => {
        let count = 0;
        if (io.sockets.adapter.rooms[room.name]) {
            count = io.sockets.adapter.rooms[room.name].length;
        }
        return {
            ...room,
            participants: count,
        };
    });
}

setInterval(() => {
    io.emit('rooms', roomsWithParticipants());
}, 1000)

io.on('connection', (socket) => {
    let room;

    socket.emit('rooms', roomsWithParticipants());

    socket.on('disconnect', () => {
        socket.leave(room);
        state.purge(socket.id);
    });

    socket.on('join', (name) => {
        socket.leave(room);
        room = name;
        socket.join(room);
        state.refresh(room);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('leave', () => {
        socket.leave(room);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('vote', (text) => {
        state.vote(room, text, socket.id);
    });

    socket.on('create', (name) => {
        state.create(name, io);
        io.emit('rooms', roomsWithParticipants());
        // state.refresh
    });

    socket.on('alive', (name) => {
        state.refresh(name);
        io.emit('rooms', roomsWithParticipants());
    });
});

module.exports = {
    io,
    http,
};
