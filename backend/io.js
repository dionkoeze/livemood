const app = require('./app');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const state = require('./state')(io);

// test
state.create('testRoom', io.to('testRoom'));

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
}, 10000)

io.on('connection', (socket) => {
    let room;

    socket.emit('rooms', roomsWithParticipants());

    socket.on('disconnect', () => {
        socket.leave(room);
    });

    socket.on('join', (name) => {
        console.log(`socket joined ${name}`)
        socket.leave(room);
        room = name;
        socket.join(room);
        state.refresh(room);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('leave', () => {
        console.log(`socket left ${room}`);
        socket.leave(room);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('vote', (text) => {
        console.log(`voted on ${text}`);
        state.vote(room, text, socket.id);
    });

    socket.on('create', (name) => {
        state.create(name, io);
        io.emit('rooms', roomsWithParticipants());
        // state.refresh
    });

    socket.on('alive', (name) => {
        state.refresh(name);
    });
});

module.exports = {
    io,
    http,
};
