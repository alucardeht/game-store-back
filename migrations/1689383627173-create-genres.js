const Genre = require('../models/Genre');

exports.up = async function () {
    const genres = [
        {name: 'Action'},
        {name: 'Adventure'},
        {name: 'Strategy'},
        {name: 'RPG'},
        {name: 'Shooter'},
        {name: 'Racing'},
        {name: 'Sports'},
        {name: 'Simulation'},
        {name: 'Puzzle'},
        {name: 'Platformer'},
        {name: 'Survival'},
        {name: 'Fighting'},
        {name: 'Open World'},
        {name: 'Music'},
        {name: 'FPS'},
        {name: 'Retro'},
    ];

    await Genre.insertMany(genres);
};

exports.down = async function () {
    await Genre.deleteMany();
};
