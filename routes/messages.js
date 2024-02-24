const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { wrapAsync } = require('../utils');
const AppError = require('../AppError');

router.get('/', async (req, res) => {
    const excersices = await Excercise.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(excersices);
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const findExcercise = await Excercise.findOne({ name });
    if(!findExcercise) {
        const excToAdd = { name, description }
        const newExcercise = new Excercise(excToAdd);
        await newExcercise.save();
        res.send({result: 'Succesfully saved!'});    
    }else {
        res.status(401).send({message: 'Excercise already exists!' });
    }
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const excercise = await Excercise.findById(id);
    if(!excercise) {
        throw new AppError('Excercise not found', 404);
    }
    res.send(excercise);
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
        const updatedExcercise = await Excercise.findByIdAndUpdate(id, req.body);
        res.send(updatedExcercise);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedExcercise = await Excercise.findByIdAndDelete({_id: id});
    res.send(deletedExcercise);
})

module.exports = router;