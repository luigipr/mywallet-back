import  express  from "express";
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import { stripHtml } from "string-strip-html";
import { userSchema, loginSchema} from "../schemas";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

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

app.post("/cadastro", async (req, res) => {

    const {username, email, password, confirmPassword} = req.body

    const validation = userSchema.validate(req.body, { abortEarly: false })
	if (validation.error) {
		const errors = validation.error.details.map(detail => detail.message)
		return res.status(422).send(errors)
	}

    if (password !== confirmPassword) return res.status(422).send('as senhas devem ser iguais!')

    

    try {
		const user = await db.collection("usuarios").findOne({ email })
		if (user) return res.status(409).send("Esse usuario já existe!")

        const hash = bcrypt.hashSync(password, 10)
		await db.collection("usuarios").insertOne({ username, email, password: hash })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.post("/" , async (req , res) => {
//sign-in
    const {email, password} = req.body

    const validation = loginSchema.validate(req.body, { abortEarly: false })
	if (validation.error) {
		const errors = validation.error.details.map(detail => detail.message)
		return res.status(422).send(errors)
	}


    try {
        const user = await db.collection("usuarios").findOne({email})
        if (!user) return res.status(404).send("Usuário não cadastrado")

        const correctPW = bcrypt.compareSync(password, user.password)
        if (!correctPW) return res.status(401).send("Senha incorreta")

        const token = uuid()
		await db.collection("session").insertOne({ token, userID: user._id })
        res.status(200).send(token)
    } catch (err) {
    res.status(500).send(err.message)
    }
})




app.listen(process.env.PORT, console.log(`Servidor rodando na porta ${process.env.PORT}`))