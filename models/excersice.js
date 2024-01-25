const mongoose = require('mongoose');

const routineSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    lastWeight: {
        type: String,
        required: false
    },
})

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;