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
        const filteredUsersData = users.map(user => ({ username: user.username, weight: user.weight || null, height: user.height || null, email: user.email || '', id: user._id, firstName: user.firstName || '', lastName: user.lastName || '' }));
        console.log(`Date: ${req.requestTime}`);
        res.send(filteredUsersData);
    })

    router.post('/register', wrapAsync(async (req, res, next) => {
        console.log(req.body);
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
                    exp: timestampInSeconds
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
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const updatedUser = await User.findByIdAndUpdate(id, req.body);
            res.send(updatedUser);
        }catch(err) {
            res.send({message: 'It was not possible update this user.'})
        }
    })

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete({_id: id});
        res.send(deletedUser);
    })

    module.exports = router;