require('dotenv').config();
const {http} = require('./io');

http.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
