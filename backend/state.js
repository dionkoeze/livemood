const Room = require('./room');
const {isValidName} = require('./vote_validation');

function leadingZero(val) {
    if (val < 10) {
        return `0${val}`;
    } else {
        return `${val}`;
    }
}

function toHumanTime(ms) {
    let sec = Math.round(ms/1000);
    let min = Math.floor(sec / 60);
    sec %= 60;
    return `${min}:${leadingZero(sec)}`;
}

function create_state() {
    let rooms = [];
    
    function create(name, medium) {
        if (rooms.length < 10 && isValidName(name) && !rooms.find(room => room.name === name)) {
            rooms.push(new Room(name, medium));
        }
    }

    function removeRoom(name) {
        rooms = rooms.filter((room) => room.name !== name);
    }
    
    function list() {
        rooms.forEach(room => {
            if (room.expired()) {
                room.destroy();
            }
        });
        rooms = rooms.filter(room => !room.expired());
        return rooms.map(room => 
            {
                return {
                    name: room.name,
                    humanTTL: toHumanTime(room.getTTL()),
                    TTL: room.getTTL(),
                };
            });
    }

    function applyToRoom(name, func) {
        const found = rooms.find((cur) => cur.name === name);
        if (found) {
            func(found);
            found.refreshTTL();
            found.send();
        }
    }
    
    function vote(name, text, id) {
        applyToRoom(name, (room) => {
            room.vote(text, id);
        });
        // const found = rooms.find((cur) => cur.name === room);
        // if (found) {
        //     found.refreshTTL();
        //     found.vote(text, id);
        // }
    }

    function removeText(name, text) {
        applyToRoom(name, (room) => {
            room.remove(text);
        });
        // const found = rooms.find((cur) => cur.name === name);
        // if (found) {
        //     found.remove(text);
        //     found.refreshTTL();
        //     found.send();
        // }
    }

    function refresh(room) {
        applyToRoom(room, () => {});
        // const found = rooms.find((cur) => cur.name === room);
        // if (found) {
        //     found.refreshTTL();
        //     found.send();
        // }
    }

    function purge(id) {
        rooms.forEach((room) => room.purge(id));
    }

    function setDefault(name, text, isDefault) {
        applyToRoom(name, (room) => {
            room.setDefault(text, isDefault);
        })        
    }

    function clear(name, text) {
        applyToRoom(name, (room) => {
            room.clear(text);
        });
    }

    return {
        create,
        removeRoom,
        list,
        vote,
        removeText,
        refresh,
        purge,
        setDefault,
        clear,
    }
}

module.exports = create_state;
