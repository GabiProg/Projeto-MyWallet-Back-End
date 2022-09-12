// import joi from 'joi';
// import bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';

// export async function SignIn (req, res)  {
//     const user = req.body;
//     const { password, confirmation } = req.body;
    
//     const userSchema = joi.object({
//         name: joi.string().required(),
//         email: joi.string().email().required(),
//         password: joi.string().required().min(6),
//         confirmation: joi.string().required().min(6)
//     });

//     const validation = userSchema.validate(user, {abortEarly: false});

//     if(validation.error){
//         const erros = validation.error.details.map(detail => detail.message);
//         res.status(422).send(erros);
//         return;
//     }

//     if(password !== confirmation){
//         res.sendStatus(409);
//         return;
//     }

//     try {
//         const alreadyAuser = await db.collection('cadastros').findOne(user);
//         if(alreadyAuser){
//             res.sendStatus(409);
//             return;
//         }

//         const cryptoPassword = bcrypt.hashSync(password, 10);
//         const cryptoPasswordConfirmation = bcrypt.hashSync(confirmation, 10);

//         await db.collection('cadastros').insertOne({...user, password: cryptoPassword, confirmation: cryptoPasswordConfirmation});

//         res.status(201).send('Usuário cadastrado.');

//     } catch (err) {
//         res.sendStatus(500);
//     }
// };

// export async function LogIn (req, res) {
//     const { email, password } = req.body;

//     const userSchema = joi.object({
//         email: joi.string().email().required(),
//         password: joi.string().required().min(6)
//     });

//     const validation = userSchema.validate(req.body, {abortEarly: false});

//     if(validation.error){
//         const erros = validation.error.details.map(detail => detail.message);
//         res.status(422).send(erros);
//         return;
//     }

//     try {
//         const findUser = await db.collection('cadastros').findOne({email: email});

//         if(findUser && bcrypt.compareSync(password, findUser.password)){

//             const token = uuid();

//             await db.collection('sessoes').insertOne({
//                 token,
//                 userId: findUser._id
//             });

//             res.status(201).send({token, name: findUser.name});

//             return;
//         } else {
//             res.status(401).send('Senha ou e-mail incorretos.');
//             return;
//         }

//     } catch (err){
//     res.sendStatus(500);
//     }   

// };