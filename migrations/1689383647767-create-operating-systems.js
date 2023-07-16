const OperatingSystem = require('../models/OperatingSystem');

exports.up = async function () {
    const operatingSystems = [
        {name: 'Windows'},
        {name: 'macOS'},
    ];

    await OperatingSystem.insertMany(operatingSystems);
};

exports.down = async function () {
    await OperatingSystem.deleteMany();
};
