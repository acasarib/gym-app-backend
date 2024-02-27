const mongoose = require('mongoose');

const routineSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    excercises: [{
        name: String,
        description: String,
        rest: Number,
        series: Number,
        repetitions: String,
        progression: {
            type: [String],
            required: false
        }
    }],
    duration: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false
    }
})

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;