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
        const filteredUsersData = users.map(user => ({ username: user.username, weight: user.weight || null, height: user.height || null, email: user.email || '', id: user._id, firstName: user.firstName || '', lastName: user.lastName || '', lastPaymentDate: user.lastPaymentDate || '', admissionDate: user.admissionDate || '', isAdmin: user.isAdmin || false, phoneNumber: user.phoneNumber || 0 }));
        console.log(`Date: ${req.requestTime}`);
        res.send(filteredUsersData);
    })

    router.post('/register', wrapAsync(async (req, res, next) => {
        const { username, password, firstName, lastName } = req.body;
        const findUser = await User.findOne({ username });
        if(!findUser) {
            const hash = await hashPassword(password);
            const user = {
                username,
                firstName,
                lastName,
                password: hash
            }
            if(req.body.email) user.email = req.body.email;
            if(req.body.weight) user.weight = req.body.weight;
            if(req.body.height) user.height = req.body.height;
            if(req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
            if(req.body.admissionDate) user.admissionDate = req.body.admissionDate;
            if(req.body.isAdmin) user.isAdmin = req.body.isAdmin;
            if(req.body.isMasterAdmin) user.isAdmin = req.body.isMasterAdmin;
            const newUser = new User(user);
            await newUser.save();
            req.session.user_id = user._id;
            res.send({result: 'Succesfully saved!'});
            
        }else {
            res.status(401).send({message: 'Username already exists!' });
        }
    }))

    router.post('/login', wrapAsync(async (req, res, next) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            res.status(401).send({message: 'Incorrect username or password!' });
        }else {
            const validPass = await bcrypt.compare(password, user.password);
            if(validPass) {
                const {id: sub, username} =  { id: user._id, username: user.username };
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + 60 * 60 * 1000); // 1 hora en milisegundos
                const timestampInSeconds = expirationDate.getTime(); // Convertir a segundos
                const accessToken = jwt.sign({
                    sub, 
                    username,
                    exp: timestampInSeconds,
                    isAdmin: user.isAdmin || false
                }, secret);
                console.log('logged in!!');
                //const token = twl.sign({id: sub, username: user.username, exp: Date.now() + 60 * 1000}, secret)
                req.session.user_id = user._id;
                res.status(200).send({message: 'Succesfully logged in!', accessToken });
            }else {
                res.status(401).send({message: 'Incorrect username or password!' });
            }
        }
    }))

    router.get('/message', wrapAsync(async (req, res) => {
        const findUsers = await User.find({ isAdmin: true });
        let ids = [];
        if(findUsers.length > 0) {
            findUsers.forEach(user => {
                ids.push(user._id);
            });
        }
        res.send(ids);
    }))

    router.get('/getByUsername/:username', wrapAsync(async (req, res) => {
        const { username } = req.params;
        const findUser = await User.find({ username });
        if(!findUser) {
            res.status(404).send({message: 'Incorrect username!' });
        }else {
            res.send(findUser);
        }
    }))

    router.post('/auth', wrapAsync(async (req, res, next) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            res.status(404).send({message: 'Incorrect username or password!' });
        }else {
            const validPass = await bcrypt.compare(password, user.password);
            if(validPass) {
                res.status(200).send({message: 'Succesfully authenticated!' });
            }else {
                res.status(404).send({message: 'Incorrect username or password!' });
            }
        }
    }))

    router.put('/change-pass', wrapAsync(async (req, res, next) => {
        const { username, newPassword } = req.body;
        const findUser = await User.findOne({ username });
        if(findUser) {
            const password = await hashPassword(newPassword);
            await User.findByIdAndUpdate(findUser._id, {password});
            res.send({result: 'Succesfully saved!'});
            
        }else {
            res.status(404).send({message: 'User nor found!' });
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
        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            height: user.height || 0,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber || 0,
            weight: user.weight || 0,
            admissionDate: user.admissionDate || null,
            isAdmin: user.isAdmin || false,
            lastPaymentDate: user.lastPaymentDate || null
        };
        res.send(userInfo);
    }))

    // la diferencia entre put y patch es que put actualiza todo 
    router.put('/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const userInfo = req.body;
        if(userInfo.password) {
            const newPass = await hashPassword(userInfo.password);
            userInfo.password = newPass;
        }
        const updatedUser = await User.findByIdAndUpdate(id, userInfo);
        res.send(updatedUser);
    }))

    router.put('/:id/lastPayment', wrapAsync(async (req, res) => {
        const { id } = req.params;
            const updatedUser = await User.findByIdAndUpdate(id, req.body);
            res.send(updatedUser);
    }))

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete({_id: id});
        res.send(deletedUser);
    })

    module.exports = router;