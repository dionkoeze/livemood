const express = require('express');
const vueRoutes = require('./vue_routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(vueRoutes);

module.exports = app;