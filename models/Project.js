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
        required: true
    },
    members : {
        type: Array,
        required: true
    },
    bugs: {
        type: Array,
        required: true
    }

})

ProjectSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Project', ProjectSchema);