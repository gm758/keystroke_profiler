const express = require('express');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');
const path = require('path');
const app = express();

app.use(favicon(path.join(__dirname, '../client/assets/favicon.ico')));

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

console.log('Server listening on 8000')
app.listen(8000);

module.exports = app;