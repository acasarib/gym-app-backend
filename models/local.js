const mongoose = require('mongoose');
const Student = require('./student');

const localSchema = mongoose.Schema({
    company: {
        type: String,
        required: true
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
    companyLogoUrl: {
        type: String,
        required: true
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] //podria ser array de objetos cada uno con datos tipados. 
})

//para array de ids se debera agregar lo siguiente: students: [{ type: mongoose.Schema.Types.ObjectId }]. luego para agregar uno agrego todo el objeto y solo lo cambia por el id
//para que cuando trae los datos traiga todo se usa el metodo .populate('products') por ej. si uso segundo parametro me trae solo el dato que indico y el id. ej: .populate('products', 'name')
//si son muchos los datos referenciales que tengo que guardar conviene guardar el id del padre en el hijo. ej: peliculas donde actua un actor (se guarda el id_actor en las peliculas).
// para no insertar id se tiene que agregar en el elemento deseado _id: { _id: false }
//si se quiere modificar un elemento dentro de un array se puede obtener, igualar a variable, modificar y guardar 

const Local = mongoose.model('Local', localSchema);

module.exports = Local;