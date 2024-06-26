const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is reuired']
    },
    firstName: {
        type: String,
        required: [true, 'Name is reuired']
    },
    lastName: {
        type: String,
        required: [true, 'Lastname is reuired']
    },
    password: {
        type: String,
        required: [true, 'Password is reuired']
    },
    weight: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    admissionDate: {
        type: Date,
        required: false
    },
    lastPaymentDate: {
        type: Date,
        required: false
    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    isMasterAdmin: {
        type: Boolean,
        required: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;