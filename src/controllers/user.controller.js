import { db } from "../app.js";



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
	const {type} = req.params;

	const token = authorization?.replace('Bearer ', '');
	try{
        const session = db.collection.apply("sessions").findOne({token})
		const user = await db.collection("usuarios").findOne({ _id: session.userId })
		delete user.password;
		const date = dayjs().format("DD:MM")
		const transaction = { userId: user._id, value, description, type, date}
	
		await db.collection("transactions").insertOne({ transaction })
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
		const session = await db.collection("sessions").findOne({token})
		const user = await db.collection("usuarios").findOne({_id: session.userId})

		const userTransactions = db.collection("transactions").findMany({userId: user._id})

		res.status(200).send(userTransactions)
	} catch (err) {
		res.status(500).send(err)
	}
}