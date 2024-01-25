const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const { wrapAsync } = require('../utils');

//si necesito usar un middleware utilizo router.use(el middleware)

// Company crud

router.get('/', async (req, res) => {
    const { location } = req.query;
    if(location) {
        const companies = await Company.find({location: location});
        res.send(companies);
    }else {
        const companies = await Company.find({});
        console.log(`Date: ${req.requestTime}`);
        res.send(companies);
    }
})

router.post('/new', wrapAsync(async (req, res, next) => {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.send('Succesfully saved!' + newCompany);
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const company = await Company.findById(id);
    if(!company) {
        throw new AppError('Company not found', 404);
    }
    res.send(company);
}))

// la diferencia entre put y patch es que put actualiza todo 
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCompanie = await Company.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.send(updatedCompanie);
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCompanie = await Company.findByIdAndDelete(id);
    res.send(deletedCompanie);
})

module.exports = router;