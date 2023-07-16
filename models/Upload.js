const mongoose = require('mongoose');

const {Schema} = mongoose;

const uploadSchema = new Schema({
    schema: {type: String, required: true},
    itemId: {type: Schema.Types.ObjectId, refPath: 'schema', required: true},
    type: {type: String, required: true},
    hash: {type: String, required: true},
    uploadDate: {type: Date, default: Date.now},
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
