const mongoose = require('mongoose');

const IronMessageSchema = new mongoose.Schema({
    message: String,
    userId: String,
    type: String
});


module.exports = mongoose.model('ironMessage', IronMessageSchema, 'ironMessage');