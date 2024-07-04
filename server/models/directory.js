// server/models/directory.js
const mongoose = require('mongoose');

const directorySchema = new mongoose.Schema({
  code: String,
  type: String,
  name: String,
  startDate: Date,
  endDate: Date
});

const Directory = mongoose.model('Directory', directorySchema);

module.exports = Directory;