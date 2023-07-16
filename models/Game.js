const mongoose = require('mongoose');

const {Schema} = mongoose;

const gameSchema = new Schema({
    catalogImage: {type: Schema.Types.ObjectId, ref: 'Upload', required: true},
    headerImage: {type: Schema.Types.ObjectId, ref: 'Upload', required: true},
    screenshots: [{type: Schema.Types.ObjectId, ref: 'Upload'}],
    pageUrl: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    shortDescription: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    genres: [{type: Schema.Types.ObjectId, ref: 'Genre', required: true}],
    operatingSystems: [{type: Schema.Types.ObjectId, ref: 'OperatingSystem', required: true}],
    builds: [{type: Schema.Types.ObjectId, ref: 'Build', required: true}],
    // Não tinha nos requisitos mas é necessário para cumprir as solicitações do front-end
    releaseDate: {type: Date, required: true},
    price: {type: Number, required: true},
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

