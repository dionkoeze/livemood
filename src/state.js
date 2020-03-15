const {io} = require('./server');

let defaultLabels = ['Te snel!', 'Booooring...', 'Cooooool', 'Need... coffee...'];
let labels = defaultLabels.map(label => {
    return {
        text: label,
        default: true,
        votes: [],
    }
});

function sendUserCount() {
    io.emit('user-count', Object.keys(io.sockets.connected).length);
}

function send(medium) {
    const toSend = labels.map(label => {
        return {
            ...label,
            votes: label.votes.reduce((acc, vote) => acc + vote.weight, 0),
        };
    });

    toSend.sort((a, b) => b.votes - a.votes);

    medium.emit('label-list', toSend);
}

function vote(id, votedLabel) {
    if (votedLabel.length < 21) {
        let label = labels.find(label => label.text === votedLabel);

        if (!label) {
            // ugly...
            if (labels.length > 9) {
                return;
            }

            label = {
                text: votedLabel,
                default: false,
                votes: [],
            };

            labels.push(label);
        }
        
        const vote = label.votes.find(vote => vote.id === id);
        
        if (vote) {
            vote.weight = 1;
        } else {
            label.votes.push({
                id,
                weight: 1.0,
            });
        }
        
        send(io);
    }
}

function labelRemains(label) {
    return label.default || 0.1 < label.votes.reduce((acc, cur) => acc + cur.weight, 0);
}

// 15000 ms and factor 0.841 gives half life of a minute
setInterval(() => {
    labels.forEach(label => {
        label.votes = label.votes
            .map(vote => {
                return {
                    id: vote.id,
                    weight: vote.weight * 0.841,
                };
            });
    });

    labels = labels.filter(labelRemains);

    send(io);
}, 15000);

module.exports = {
    sendUserCount,
    send,
    vote,
};
