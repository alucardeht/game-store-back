const {model, Schema} = require('mongoose');

const osSchema = new Schema({
    name: {type: String, required: true},
});

const OperatingSystem = model('OperatingSystem', osSchema);

module.exports = OperatingSystem;
