const Prompt = require('./promptModel.js');
const promisify = require('es6-promisify');

const getAllPrompts = promisify(Prompt.find);

module.exports = {
  randomPrompt: function (req, res, next) {  //es7?
    getAllPrompts({})
      .then((prompts) => {
        const rVal = Math.floor(Math.random() * prompts.length);
        res.json(prompts[rVal]);
      })
  }
}
