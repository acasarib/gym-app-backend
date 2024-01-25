const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    locals: {
        type: [String],
        required: true
    },
    adress: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    routines: {
        type: [String],
        required: false
    },
    activeRoutineId: {
        type: String,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    heigth: {
        type: Number,
        required: false
    },
    bloodGroup: {
        type: String,
        required: false
    }
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;