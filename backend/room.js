const isValidText = require('./vote_validation');

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
        const sneller = new Label('Mag sneller :)');
        sneller.default = true;
        const tesnel = new Label('Te snel!');
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
            console.log('update');
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
        console.log(`${this.name} destroyed`);
        clearInterval(this.int);
    }

    send() {
        this.labels = this.labels.filter(label => label.stays());

        const toSend = this.labels.map(label => {
            return {
                ...label,
                votes: label.weight(),
            };
        });

        this.io.to(this.name).emit('votes', toSend);
        let personal = this.labels.reduce((acc, cur) => {
            cur.votes.forEach((vote) => {
                if (!acc[vote.id]) {
                    acc[vote.id] = [];
                }
                acc[vote.id].push({
                    text: cur.text,
                    vote: vote.weight(),
                })
                // acc[vote.id].text = cur.text;
                // acc[vote.id].vote = vote.weight();
            });

            return acc;
        }, {});

        for (let person in personal) {
            console.log(person)
            console.log(personal[person])
            this.io.to(person).emit('myvotes', personal[person]);
        }

        console.log(personal);
    }

    vote(text, id) {
        console.log(`voted on ${text} in room ${this.name} by ${id}`);

        this.refreshTTL();

        if (this.labels.length < 10 && isValidText(text)) {
            let label = this.labels.find(label => label.text === text);

            if (!label) {
                label = new Label(text);

                this.labels.push(label);
            }

            label.vote(id);
            
            console.log(label);
            
            this.send();
        }
    }

    remove(text) {
        this.labels = this.labels.filter(label => label.text !== text);
    }
};

module.exports = Room;
