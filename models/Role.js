const {model, Schema} = require('mongoose');

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

const Role = model('Role', roleSchema);

module.exports = Role;
