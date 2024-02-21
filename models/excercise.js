const mongoose = require('mongoose');

const excerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

const Excercise = mongoose.model('Excercise', excerciseSchema);

module.exports = Excercise;