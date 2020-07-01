const router = require('express').Router();

// Our resource routes
(require('./routes/pages'))(router);
(require('./routes/plans'))(router);
(require('./routes/users'))(router);
(require('./routes/sessions'))(router);

module.exports = router;