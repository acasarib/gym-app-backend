const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Local = require('./local');

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    location: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    locals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Local' }]
})

companySchema.pre('findOneAndDelete', async function(data) {
    console.log('Pre delete middleware', data);
})

companySchema.post('findOneAndDelete', async function(company) {
    if(company.locals.length > 0) {
        const deletedLocals = await Local.deleteMany({_id: {$in: company.locals}});
        console.log(deletedLocals);
    }
    console.log('Post delete middleware', company);
})

const Company = mongoose.model('Company', companySchema);

module.exports = Company;