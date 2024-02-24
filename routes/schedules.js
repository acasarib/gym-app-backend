const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const { wrapAsync } = require('../utils');
const AppError = require('../AppError');

router.get('/', async (req, res) => {
    const schedule = await Schedule.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(schedule);
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const { firstDays, saturday } = req.body;
        const schedule = { firstDays, saturday }
        const newSchedule = new Schedule(schedule);
        await newSchedule.save();
        res.send({result: 'Succesfully saved!'});
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body);
        res.send(updatedSchedule);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete({_id: id});
    res.send(deletedSchedule);
})

module.exports = router;