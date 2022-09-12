import express from 'express';
import cors from 'cors';
import joi from 'joi';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;
mongoClient.connect().then(() => {
    db = mongoClient.db('mywallet');
});

app.post('/sign-up', async (req, res) => {
    const user = req.body;
    const { password, confirmation } = req.body;
    
    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(6),
        confirmation: joi.string().required().min(6)
    });

    const validation = userSchema.validate(user, {abortEarly: false});

    if(validation.error){
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    if(password !== confirmation){
        res.sendStatus(409);
        return;
    }

    try {
        const alreadyAuser = await db.collection('cadastros').findOne(user);
        if(alreadyAuser){
            res.sendStatus(409);
            return;
        }

        const cryptoPassword = bcrypt.hashSync(password, 10);
        const cryptoPasswordConfirmation = bcrypt.hashSync(confirmation, 10);

        await db.collection('cadastros').insertOne({...user, password: cryptoPassword, confirmation: cryptoPasswordConfirmation});

        res.status(201).send('Usuário cadastrado.');

    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/', async (req, res) => {
    const { email, password } = req.body;

    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(6)
    });

    const validation = userSchema.validate(req.body, {abortEarly: false});

    if(validation.error){
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    try {
        const findUser = await db.collection('cadastros').findOne({email: email});

        if(findUser && bcrypt.compareSync(password, findUser.password)){

            const token = uuid();

            await db.collection('sessoes').insertOne({
                token,
                userId: findUser._id
            });

            res.status(201).send({token, name: findUser.name});

            return;
        } else {
            res.status(401).send('Senha ou e-mail incorretos.');
            return;
        }

    } catch (err){
    res.sendStatus(500);
    }   

});

app.post('/deposit', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const { description, value } = req.body;
    
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const data = `${day}/${month}`;

    try {
        const session = await db.collection('sessoes').findOne({ token });
    
        if(!session){
            res.sendStatus(401);
            return;
        }

        await db.collection('entradas').insertOne({
            userId: session.userId,
            data,
            description,
            value
        });

        res.sendStatus(201);

    } catch (err){
        res.sendStatus(500);
    }
});

app.post('/cashout', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const { description, value } = req.body;
    
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const data = `${day}/${month}`;

    try {
        const session = await db.collection('sessoes').findOne({ token });
    
        if(!session){
            res.sendStatus(401);
            return;
        }

        await db.collection('saidas').insertOne({
            userId: session.userId,
            data,
            description,
            value
        });

        res.sendStatus(201);
        
    } catch (err){
        res.sendStatus(500);
    }
});

app.get('/home', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        const session = await db.collection('sessoes').findOne({ token });
    
        if(!session){
            res.sendStatus(401);
            return;
        }

        const getEntradas = await db.collection('entradas').find({userId: session.userId}).toArray();

        const getSaidas = await db.collection('saidas').find({userId: session.userId}).toArray();

        res.status(201).send({getSaidas, getEntradas});

    } catch (err) {
        res.sendStatus(500);
    }

});



app.listen(5000, () => console.log('Listening on port 5000.'));