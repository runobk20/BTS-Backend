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
        enum: ['developer', 'tester', 'project leader'],
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    ownProjects: [
        { type:Schema.Types.ObjectId,
          ref: 'Project', 
          select: function() {
            return this.role === 'project leader'
          }}],
    projects: [{ type:Schema.Types.ObjectId, ref: 'Project', required: true }],
    bugs: [{type:Schema.Types.ObjectId, ref: 'Bug', required: false}]
});

UserSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('User', UserSchema);