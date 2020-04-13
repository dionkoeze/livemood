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
}, 10000)

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

    socket.on('removeText', (name, text) => {
        state.removeText(name, text);
    });

    socket.on('create', (name) => {
        state.create(name, io);
        io.emit('rooms', roomsWithParticipants());
        // state.refresh
    });

    socket.on('removeRoom', (name) => {
        state.removeRoom(name);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('alive', (name) => {
        state.refresh(name);
        io.emit('rooms', roomsWithParticipants());
    });

    socket.on('default', (name, text, isDefault) => {
        state.setDefault(name, text, isDefault);
    })

    socket.on('clear', (name, text) => {
        state.clear(name, text);
    });

    socket.on('auth', (password) => {
        if (password === process.env.SECRET) {
            socket.emit('authState', {
                isAdmin: true,
            });
        }
    });
});

module.exports = {
    io,
    http,
};
