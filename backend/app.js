const express = require('express');
// const roomRoutes = require('./room_routes');
const vueRoutes = require('./vue_routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors({
    // credentials: true,
    // origin: process.env.APP_URL,
    // origin: 'http://localhost:3300',
// }));
// app.use(cookieParser());

// app.use('/api', roomRoutes);

app.use(vueRoutes);

module.exports = app;