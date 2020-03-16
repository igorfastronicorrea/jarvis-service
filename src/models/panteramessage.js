const mongoose = require('mongoose');

const PanteraMessageSchema = new mongoose.Schema({
    message: String,
    userId: String,
    type: String
});


module.exports = mongoose.model('panteraMessage', PanteraMessageSchema, 'panteraMessage');