const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    firstDays: {
        type: String,
        required: true
    },
    saturday: {
        type: String,
        required: false
    }
})

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;