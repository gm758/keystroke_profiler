const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
  id: Number,
  prompt: String,
});

module.exports = mongoose.model('prompts', PromptSchema)