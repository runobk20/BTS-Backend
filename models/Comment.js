const { Schema, model } = require ('mongoose');

const CommentSchema = Schema({
    user: {
        type: Object,
        required: true
    },
    bug: {
        type: Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

CommentSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Comment', CommentSchema);