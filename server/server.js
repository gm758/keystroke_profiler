const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/profiler');

require('./config/middleware.js')(app, express);
require('./config/moddleware.js')(app, express);

app.listen(8000);

module.exports = app;