const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema({
    monthly: {
        type: Number,
        required: true
    },
    weekly: {
        type: Number,
        required: true
    },
    diary: {
        type: Number,
        required: true
    }
})

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;