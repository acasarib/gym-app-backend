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
})

const User = mongoose.model('User', userSchema);

module.exports = User;