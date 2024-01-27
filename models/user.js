const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is reuired']
    },
    password: {
        type: String,
        required: [true, 'Password is reuired']
    },
    weight: {
        type: Number,
        required: false
    },
    heigth: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;