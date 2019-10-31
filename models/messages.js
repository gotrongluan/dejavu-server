const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    receivedAt: {
        type: Date,
        default: Date.now()
    },
    seenAt: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;