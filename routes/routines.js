const express = require('express');
const router = express.Router();
const Routine = require('../models/routines');
const { wrapAsync } = require('../utils');
const AppError = require('../AppError');

router.get('/', async (req, res) => {
    const routine = await Routine.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(routine);
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const { name, excercises, duration } = req.body;
        const routineToAdd = { name, excercises, duration }
        if(req.body.owner) routineToAdd.owner = req.body.owner;
        const newRoutine = new Routine(routineToAdd);
        await newRoutine.save();
        res.send({result: 'Succesfully saved!'});
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const routine = await Routine.findById(id);
    if(!routine) {
        throw new AppError('Routine not found', 404);
    }
    res.send(routine);
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
        const updatedRoutine = await Routine.findByIdAndUpdate(id, req.body);
        res.send(updatedRoutine);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedRoutine = await Routine.findByIdAndDelete({_id: id});
    res.send(deletedRoutine);
})

module.exports = router;