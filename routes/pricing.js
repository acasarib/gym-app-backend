const express = require('express');
const router = express.Router();
const Pricing = require('../models/pricing');
const { wrapAsync } = require('../utils');
const AppError = require('../AppError');

router.get('/', async (req, res) => {
    const pricing = await Pricing.find({});
    console.log(`Date: ${req.requestTime}`);
    res.send(pricing);
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const { monthly, weekly, diary } = req.body;
        const pricing = { monthly, weekly, diary }
        const newPricing = new Pricing(pricing);
        await newPricing.save();
        res.send({result: 'Succesfully saved!'});
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
        const updatedPricing = await Pricing.findByIdAndUpdate(id, req.body);
        res.send(updatedPricing);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedPricing = await Excercise.findByIdAndDelete({_id: id});
    res.send(deletedPricing);
})

module.exports = router;