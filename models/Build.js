const mongoose = require('mongoose');

const {Schema} = mongoose;

const buildSchema = new Schema({
    version: {type: String, required: true},
    url: {type: String, required: true},
});

const Build = mongoose.model('Build', buildSchema);

module.exports = Build;
