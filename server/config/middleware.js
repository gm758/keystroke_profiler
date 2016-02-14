var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = (app, express) => {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // console.log(path.join(__dirname, '../../index.html'))
  app.use(express.static(path.join(__dirname, '../../build/')));
  app.use('/bower_components', express.static(path.join(__dirname, '../../bower_components')))

}