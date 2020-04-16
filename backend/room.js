const {isValidText} = require('./vote_validation');

class Vote {
    constructor(id) {
        this.id = id;
        this.time = new Date();
    }

    weight() {
        const now = new Date();
        const delta = now.getTime() - this.time.getTime();

        // 1 - delta / (ms/sec * sec/min * 4 min)
        // with offset to start decreasing later
        if (delta > 10000) {
            return 1 - (delta - 10000) / (1000 * 60 * 4);
        } else {
            return 1;
        }
    }

    stays() {
        return this.weight() > 0.005;
    }

    vote() {
        this.time = new Date();
    }
}

class Label {
    constructor(text) {
        this.text = text;
        this.default = false;
        this.votes = [];
    }

    weight() {
        this.votes = this.votes.filter(vote => vote.stays());
        return this.votes.reduce((acc, vote) => acc + vote.weight(), 0)
    }

    stays() {
        return this.weight() > 0.01 || this.default;
    }

    purge(id) {
        this.votes = this.votes.filter(vote => vote.id !== id);
    }

    clear() {
        this.votes = []
    }

    vote(id) {
        let vote = this.votes.find(vote => vote.id === id);

        if (!vote) {
            vote = new Vote(id);
            this.votes.push(vote);
        }

        vote.vote();
    }
}

class Room {
    constructor(name, io) {
        const cool = new Label('Coooooool!');
        cool.default = true;
        const sneller = new Label('A little quicker :)');
        sneller.default = true;
        const tesnel = new Label('Too fast!');
        tesnel.default = true;
        const coffee = new Label('Need... coffee...');
        coffee.default = true;

        this.name = name;
        this.io = io;

        this.lastActivity = new Date();

        this.labels = [
            cool,
            sneller,
            tesnel,
            coffee,
        ];

        this.int = setInterval(() => {
            this.send();
        }, 10000);

        this.send();
    }

    refreshTTL() {
        this.lastActivity = new Date();
    }

    getTTL() {
        const now = new Date();
        const delta = now.getTime() - this.lastActivity.getTime();

        // return 10000 - delta;
        // ms/sec * sec/min * min/hr
        return 1000 * 60 * 25 - delta;
    }

    expired() {
        return this.getTTL() < 0;
    }

    destroy() {
        clearInterval(this.int);
    }

    purge(id) {
        this.labels.forEach((label) => label.purge(id));
    }

    sendVotes() {
        this.labels = this.labels.filter(label => label.stays());
    
        const toSend = this.labels.map(label => {
            return {
                ...label,
                votes: label.weight(),
            };
        });
    
        this.io.to(this.name).emit('votes', {
            name: this.name,
            votes: toSend,
        });
    }

    sendPersonal() {
        let personal = this.labels.reduce((acc, cur) => {
            cur.votes.forEach((vote) => {
                if (!acc[vote.id]) {
                    acc[vote.id] = [];
                }
                acc[vote.id].push({
                    text: cur.text,
                    vote: vote.weight(),
                })
            });
    
            return acc;
        }, {});
    
        for (let person in personal) {
            this.io.to(person).emit('myvotes', {
                name: this.name,
                votes: personal[person],
            });
        }
    }

    send() {
        this.sendVotes();
        this.sendPersonal();
    }

    vote(text, id) {
        this.refreshTTL();

        if (this.labels.length < 10 && isValidText(text)) {
            let label = this.labels.find(label => label.text === text);

            if (!label) {
                label = new Label(text);

                this.labels.push(label);
            }

            label.vote(id);
            
            this.send();
        }
    }

    remove(text) {
        this.labels = this.labels.filter(label => label.default || label.text !== text);
    }

    clear(text) {
        const found = this.labels.find(label => label.text === text);

        if (found) {


            found.clear();


            // this.io.to(person).emit('myvotes', []);
        }
    }

    setDefault(text, isDefault) {
        const found = this.labels.find(label => label.text === text);

        if (found) {
            found.default = isDefault;
        }
    }
};

module.exports = Room;
