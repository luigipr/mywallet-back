import { ObjectId } from "mongodb";
import { db } from "../app.js";
import dayjs from "dayjs";


export async function signoff(req, res) {
    //logout
        const { authorization } = req.headers
        const token = authorization?.replace('Bearer ', '');
    
    
        try {
    
        const session = await db.collection("sessions").deleteOne({ token });      
        if (session.deletedCount === 0) res.sendStatus(404)	
    
        res.sendStatus(200);
        } catch (err) {
          res.sendStatus(401);
        }
};

export async function transaction(req, res) {
	const { authorization } = req.headers;
	const {value , description} = req.body;
	const {tipo} = req.params;
    console.log(req.params)
    console.log(tipo)
    if (tipo !== 'entrada' && tipo !== 'saida') return res.status(422).send('defina um tipo') 

	const token = authorization?.replace('Bearer ', '');
    console.log(token)
	try{
        const session = await db.collection("sessions").findOne({token})
        console.log(session)
		const user = await db.collection("usuarios").findOne({ _id: session.userID })
		delete user.password;
        console.log(user)
		const date = dayjs().format("DD/MM")
        console.log(date)
		//const transaction = { userID: user._id, value, description, tipo, date}
        //console.log(transaction)
		await db.collection("transactions").insertOne({ userID: user._id, value, description, tipo, date })
			//await db.collection('usuarios').updateOne({ username: user.username}, {$set: user.balance = user.balance + value});
			//await db.collection('usuarios').updateOne({ username: user.username}, { $push: { transactions: { value, description, date, type} }});
		return res.status(201).send(user)

	}catch (err) {
		res.status(500).send(err)
	}
}

export async function userTransactions(req, res) {
	const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	try{
        //{session} = res.locals;
		const session = await db.collection("sessions").findOne({token})
        console.log(session)
		const user = await db.collection("usuarios").findOne({_id: session.userID})
        delete user.password;
        console.log(user)
		const userTransactions = await db.collection("transactions").find({userID: user._id}).toArray()
        console.log(userTransactions)
		res.status(200).send(userTransactions)
	} catch (err) {
		res.status(500).send(err)
	}
}