import  express  from "express";
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
//criando a api
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config();
console.log(process.env.DATABASE_URL)
//conectando ao mongo
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
	await mongoClient.connect()
	console.log("MongoDB conectado!")
} catch (err) {
	(err) => console.log(err.message)
}
export const db = mongoClient.db()

//codigo
app.use(authRouter)
app.use(userRouter)




// app.post("/cadastro", signup)
// app.post("/" , signin)
// app.delete("/home", signoff);
// app.post("/nova-transacao/:tipo", transaction)
// app.get("/home", userTransactions)



app.listen(process.env.PORT, console.log(`Servidor rodando na porta ${process.env.PORT}`))