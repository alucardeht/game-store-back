const mongoose = require('mongoose');

const {Schema} = mongoose;

const librarySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    game: {type: Schema.Types.ObjectId, ref: 'Game', required: true, unique: true},
    addedAt: {type: Date, default: Date.now},
});

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;
