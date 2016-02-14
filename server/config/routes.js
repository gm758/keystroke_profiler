let prompts = require('../prompts.js');
let entries = require('../entries.js');

module.exports = (app, express) => {
  app.get('/', (req, res) => {
    res.render('index');
  })

  app.get('/api/prompts', (req, res) => {
    const rVal = Math.floor(Math.random() * prompts.length);
    res.send(200, prompts[rVal]);
  });

  app.get('/api/entries', (req, res) => {
    console.log(entries);
    res.send(200, JSON.stringify(entries));
  })

  //TODO: flesh out
  app.post('/api/entries', (req, res) => {
    const data = req.body;
    entries.push(data);
    res.send(200);
  });
};