const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const flash = require('connect-flash');

const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);
    console.log(salt, hash)
} 

const login = async (pass, hashPassword) => {
   const result = await bcrypt.compare(pass, hashPassword);
   if(result) {
    console.log('Logged in');
   }else {
    console.log('Not logged in');
   }
}

login('monkey', '$2b$12$QiMxp5KIn7I.QfObrw1V9uKwh3ta52k.xPElLTJrnr18V8BycDn.i')

//hashPassword('monkey');

const session = require('express-session');

app.use(flash());

const sessionData = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false};

app.use(session(sessionData));// el parametro es el secret

const cookieParser = require('cookie-parser');
const { rawListeners } = require('./models/company');
app.use(cookieParser('thisismysecret')); //aca iria una clave secret guardada en env.

app.get('/greet', (req, res) => {
    const { username } = req.session;
    console.log(req.cookies);
    console.log(req.signedCookies);//veo las cookies firmadas
    res.send(`Hola ${username}`)
})

app.get('/setname', (req, res) => {
    res.cookie('name', 'Lolo', {signed: true});
    res.send('Cookie sent')
})

app.get('/viewcount', (req, res) => {
    if(req.session.count) {
        req.session.count += 1;
        req.flash('success', 'New count')
    }else {
        req.session.count = 1;
    }

    res.send(`Session sent ${req.session.count}`)
})

app.get('/register', (req, res) => {
    const { username = 'Anonymous' } = req.query;
    req.session.username = username;
    res.send(`Bienvenido ${username}`)
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})