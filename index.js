const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Local = require('./models/local');
const morgan = require('morgan');
const dotenv = require("dotenv");
dotenv.config();
const AppError = require('./AppError');
const companiesRoutes = require('./routes/companies');
const userRoutes = require('./routes/user');
const session = require('express-session');
const db_url = process.env.MONGO_URI;
const secret = process.env.secret;

app.use(session({secret: 'notagoodsecret'}))
mongoose.set('strictQuery', true)
app.use(express.json()); //sirve para tratar el body del post si viene por json

const options = {
    origin: ['https://gym-routines-app.vercel.app', 'http://localhost:3000'],
}
app.use(cors(options))

app.use('/companies', companiesRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        if (req.path !== '/user/login' && req.path !== '/user/register') {
            if(Date.now() > payload.exp) {
                next();
            }else {
                res.status(401).send({message: 'Unauthorized'});
            }
        }else {
            next();
        }
    }catch(err) {
        res.status(401).send({error: err.message});
    }
})

main().catch(err => console.log(err, 'Errorrrrrrrrrrr'));

async function main() {
  await mongoose.connect(db_url);
  console.log('Mongoose open');
  //'mongodb://127.0.0.1:27017/gymRoutinesApp'
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const verifyPass = (req, res, next) => {
    const { password } = req.query;
    if(password === 'pepe') {
        next();
    }else{
        res.status(401);
        throw new AppError('Password is required', 401);
    }
}

const handleValidationError = err => {
    console.log(err);
    return new AppError(`Validation failed...${err.message}`, 400);
}
//status 403 si tenes token pero no sos admin
app.use(morgan('tiny'))

app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log('Incoming request!');
    return next(); //next sera obligatorio para continuar el proceso e intentar matchear con una ruta. el return culmina la ejecucion, por lo  que despues pasara al siguiente middleware si o si.
})
//los middlewares se pueden personalizar solo para una ruta especifica aclarandola como primer parametro y segundo el callback

app.use(express.urlencoded({ extended: true })); //sirve para tratar el body del post si viene por form
app.use(express.json()); //sirve para tratar el body del post si viene por json

/*app.get('/', (req, res) => {
    res.send('Home page!');
})*/

app.get('/password', verifyPass, async (req, res) => {
    console.log('Ypu are logged in!');
})

// Local crud

app.get('/locals', async (req, res) => {
    const locals = await Local.find({});
    res.send(locals);
})

app.get('/locals/:id', async (req, res) => {
    const { id } = req.params;
    const local = await Local.findById(id);
    res.send(local);
})

app.post('/locals/new', async (req, res) => {
    const locals = await Company.find({});
    res.send(companies);
})

app.use((req, res) => {
    res.status(404).send('Not found');
})

//cuando se quiere manejar errores en un middleware se deben agregar cuatro parametros donde el primero es el error.
app.use((err, req, res, next) => {
    console.log('*************************');
    console.log('**********ERROR**********');
    console.log('*************************');
    console.log(err.name);
    if(err.name === 'ValidationError'){
        err = handleValidationError(err);
    }
    next(err);
})

app.listen(8080, () => {
    console.log('Listening on port 8080!!!');
})