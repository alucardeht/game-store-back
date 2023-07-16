const Role = require('../models/Role');

exports.up = async function () {
    const roles = [
        {name: 'Client'},
        {name: 'Developer'}
    ];

    await Role.insertMany(roles);
};

exports.down = async function () {
    await Role.deleteMany({});
};
