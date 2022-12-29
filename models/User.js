const {Schema, model, } = require('mongoose')

const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    ownProjects: [{ type:Schema.Types.ObjectId, ref: 'Project', required: true }],
    projects: [{ type:Schema.Types.ObjectId, ref: 'Project', required: true }]
});

UserSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('User', UserSchema);