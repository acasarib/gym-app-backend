const mongoose = require('mongoose');

const routineSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    excercises: {
        type: [Object],
        required: false
    },
    duration: {
        type: String,
        required: false
    },
})

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;