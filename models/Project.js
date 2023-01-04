const {Schema, model} = require('mongoose');

const ProjectSchema = Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    bugs: [{ type: Schema.Types.ObjectId, ref: 'Bug', required: true }]
});

ProjectSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Project', ProjectSchema);