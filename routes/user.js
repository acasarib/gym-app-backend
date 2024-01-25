const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { wrapAsync } = require('../utils');
const bcrypt = require('bcrypt');
const AppError = require('../AppError');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

//si necesito usar un middleware utilizo router.use(el middleware)

// User crud

const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
} 

router.get('/', async (req, res) => {
    const users = await User.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(users);
})

router.post('/register', wrapAsync(async (req, res, next) => {
    console.log(req.body);
    const { username, password } = req.body;
    const hash = await hashPassword(password);
    const user = {
        username,
        password: hash
    } 
    const newUser = new User(user);
    await newUser.save();
    req.session.user_id = user._id;
    res.send('Succesfully saved!' + newUser);
}))

router.post('/login', wrapAsync(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) {
        throw new AppError('Incorrect username or password!', 401);
    }else {
        const validPass = await bcrypt.compare(password, user.password);
        if(validPass) {
            console.log('logged in!!');
            //const token = twl.sign({id: sub, username: user.username, exp: Date.now() + 60 * 1000}, secret)
            req.session.user_id = user._id;
            res.status(200).send('Succesfully logged in!');
        }else {
            throw new AppError('Incorrect username or password!', 401);
        }
    }
}))

router.post('/logout', wrapAsync(async (req, res, next) => {
    req.session.user_id = null;
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
        throw new AppError('User not found', 404);
    }
    res.send(user);
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.send(updatedUser);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    res.send(deletedUser);
})

module.exports = router;