import  express  from "express";
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import { stripHtml } from "string-strip-html";
import { userSchema, loginSchema, transactionSchema} from "../schemas.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs";
import Joi from "joi";
import { signin, signup, signoff } from "./controllers/authController.js";
//criando a api
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config();
//conectando ao mongo
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
	await mongoClient.connect()
	console.log("MongoDB conectado!")
} catch (err) {
	(err) => console.log(err.message)
}
const db = mongoClient.db()

//codigo

//sign-up
app.post("/cadastro", signup)

//sign-in
app.post("/" , signin)

//signoff
app.delete("/home", signoff);


app.post("/nova-transacao/:tipo", async (req, res) => {
	const { authorization } = req.headers["authorization"];
	const {value , description} = req.body;
	const {tipo} = req.params;

	if (tipo !== 'entrada' || tipo !== 'saida') res.sendStatus(422);
	const validation = transactionSchema.validate(req.body, { abortEarly: false })
	if (validation.error) {
		const errors = validation.error.details.map(detail => detail.message)
		return res.status(422).send(errors)
	}

	const token = authorization?.replace('Bearer ', '');
	if(!token) return res.sendStatus(401);

	try{

		const userId = await validateToken(token);
    	if (!userId) return res.sendStatus(401);

		const user = await db.collection("usuarios").findOne({ _id: new ObjectId(userId) })
		delete user.password;
		const date = dayjs().format("DD:MM")
	
		if (tipo === 'entrada') {
			await db.collection('usuarios').updateOne({ username: user.username}, {$set: user.balance = user.balance + value});
			await db.collection('usuarios').updateOne({ username: user.username}, { $push: { value, description, type: 'entrada'} });
			return res.sendStatus(201)
		}
		if (tipo === 'saida') {
			await db.collection('usuarios').updateOne({ username: user.username}, {$set: user.balance = user.balance - value});
			await db.collection('usuarios').updateOne({ username: user.username}, { $push: { transactions: { value, description, date, type: 'saida'} }});
			return res.sendStatus(201)
		}
	}catch (err) {
		res.status(500).send(err)
	}
})

app.get("/home", async (req, res) => {
	const { authorization } = req.headers["authorization"];
	const token = authorization?.replace('Bearer ', '');
	if(!token) return res.sendStatus(401);

	try{

		const userId = await validateToken(token);
    	if (!userId) return res.sendStatus(401);
		const user = await db.collection("usuarios").findOne({ _id: new ObjectId(userId) })
		delete user.password;

		res.status(200).send(user.transactions)
	} catch (err) {
		res.status(500).send(err)
	}
})

async function validateToken(token) {
	const session = await db.collection("sessions").findOne({ token });
	return session?.userId || null;
}










app.listen(process.env.PORT, console.log(`Servidor rodando na porta ${process.env.PORT}`))