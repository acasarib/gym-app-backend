const mongoose = require('mongoose');
const Local = require('./models/local');

main().catch(err => console.log(err, 'Errorrrrrrrrrrr'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gymRoutinesApp');
  console.log('Mongoose open');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const c = new Local({
    name: 'Ironland',
    location: 'San Carlos de Bolívar',
    adress: 'Ignacio Rivas 675',
    email: 'manu11_rodriguez@hotmail.com',
    phone: 5492314627246,
    logoUrl: 'https://res.cloudinary.com/dsxl4iwrd/image/upload/v1704734914/WhatsApp_Image_2024-01-08_at_14.12.11_302fbbe6_mjpqng.jpg'
})
c.save().then(c => {
    console.log(c);
})
.catch(e => console.log(e))