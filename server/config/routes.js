let prompts = require('../prompts.js');
let transitions = require('../transitions.js');
let pressTimes = require('../pressTimes.js');

module.exports = (app, express) => {
  app.get('/', (req, res) => {
    res.render('index');
  })

  app.get('/api/prompts', (req, res) => {
    const rVal = Math.floor(Math.random() * prompts.length);
    res.send(200, prompts[rVal]);
  });

  app.get('/api/transitions', (req, res) => {
    console.log(transitions);
    res.send(200, JSON.stringify(transitions));
  })

  //TODO: flesh out
  app.post('/api/transitions', (req, res) => {
    const data = req.body;
    transitions.push(data);
    res.send(200);
  });

  app.get('/api/pressTimes', (req, res) => {
    console.log(pressTimes)
    res.send(200, JSON.stringify(pressTimes));
  })

  app.post('/api/pressTimes', (req, res) => {
    const data = req.body;
    pressTimes.push(data);
    res.send(200);
  });
};