const express = require('express');
const router = express.Router();
const history = require('connect-history-api-fallback');
const path = require('path');

// this catches all routes not handled so far and serves the vue app
router.use(history());

router.use(express.static(path.join(__dirname, '../dist')));

module.exports = router;
