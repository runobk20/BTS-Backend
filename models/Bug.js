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
        type: String,
        required: true
    },
    date: {
        type: String,
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
        type: Object,
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    assignedTo: {
        type: Object,
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }
})

BugSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Bug', BugSchema);