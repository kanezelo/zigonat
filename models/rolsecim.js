const mongoose = require('mongoose');

const rolSecimSchema = new mongoose.Schema({
  channelId: String,
  messageId: String
});

const RolSecim = mongoose.model('RolSecim', rolSecimSchema);

module.exports = RolSecim;
