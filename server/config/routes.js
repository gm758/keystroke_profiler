const prompts = require('../prompts.js');

module.exports = (app, express) => {
  app.get('/', (req, res) => {
    res.render('index');
  })


  app.get('/api/prompts', (req, res) => {
    const rVal = Math.floor(Math.random() * prompts.length);
    res.send(200, prompts[rVal]);
  });
};