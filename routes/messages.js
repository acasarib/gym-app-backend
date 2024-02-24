const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { wrapAsync } = require('../utils');
const AppError = require('../AppError');

router.get('/', async (req, res) => {
    const messages = await Message.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(messages);
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const { type, description } = req.body;
        const msgToAdd = { type, description }
        const newMessage = new Message(msgToAdd);
        await newMessage.save();
        res.send({result: 'Succesfully saved!'});
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const message = await Message.findById(id);
    if(!message) {
        throw new AppError('Message not found', 404);
    }
    res.send(message);
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
        const updatedMessage = await Message.findByIdAndUpdate(id, req.body);
        res.send(updatedMessage);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete({_id: id});
    res.send(deletedMessage);
})

module.exports = router;