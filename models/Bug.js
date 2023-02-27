const {Schema, model} = require('mongoose');

const BugSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    stepsToRep: {
        type: String,
        required: true
    },
    actualResult: {
        type: String,
        required: true
    },
    expectedResult: {
        type: String,
        required: true
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    assignedTo: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
    comments: {
        type: Array,
        required: false
    }
})

BugSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Bug', BugSchema);