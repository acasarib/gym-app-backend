const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    type: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('Message', messagesSchema);

module.exports = Message;