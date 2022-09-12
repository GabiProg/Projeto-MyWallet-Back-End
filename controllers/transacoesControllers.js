// import { v4 as uuid } from 'uuid';

// export async function Sessoes (req, res) {
//     const { authorization } = req.headers;
//     const token = authorization?.replace('Bearer ', '');
//     const { description, value } = req.body;
    
//     const date = new Date();
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const data = `${day}/${month}`;

//     try {
//         const session = await db.collection('sessoes').findOne({ token });
    
//         if(!session){
//             res.sendStatus(401);
//             return;
//         }

//         await db.collection('entradas').insertOne({
//             userId: session.userId,
//             data,
//             description,
//             value
//         });

//         res.sendStatus(201);

//     } catch (err){
//         res.sendStatus(500);
//     }
// };

// export async function Retirada (req, res) {
//     const { authorization } = req.headers;
//     const token = authorization?.replace('Bearer ', '');
//     const { description, value } = req.body;
    
//     const date = new Date();
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const data = `${day}/${month}`;

//     try {
//         const session = await db.collection('sessoes').findOne({ token });
    
//         if(!session){
//             res.sendStatus(401);
//             return;
//         }

//         await db.collection('saidas').insertOne({
//             userId: session.userId,
//             data,
//             description,
//             value
//         });

//         res.sendStatus(201);
        
//     } catch (err){
//         res.sendStatus(500);
//     }
// };

// export async function Registros (req, res) {
//     const { authorization } = req.headers;
//     const token = authorization?.replace('Bearer ', '');

//     try {
//         const session = await db.collection('sessoes').findOne({ token });
    
//         if(!session){
//             res.sendStatus(401);
//             return;
//         }

//         const getEntradas = await db.collection('entradas').find({userId: session.userId}).toArray();

//         const getSaidas = await db.collection('saidas').find({userId: session.userId}).toArray();

//         res.status(201).send({getSaidas, getEntradas});

//     } catch (err) {
//         res.sendStatus(500);
//     }
// };