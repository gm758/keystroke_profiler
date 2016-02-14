const prompts = require('prompts.js');

module.exports = (app, express) => {
  app.get('/api/prompts', () => {
    const rVal = Math.floor(Math.random() * prompts.length);
    res.send(200, prompts[rVal]);
  });
  app.post('/api/prompts', promptController.newPrompt);
};