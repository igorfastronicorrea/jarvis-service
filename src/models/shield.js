const mongoose = require('mongoose');

const ShieldSchema = new mongoose.Schema({
    message: String,
    userId: String,
    audio: String
});


module.exports = mongoose.model('shield', ShieldSchema, 'shield');