import { userSchema, loginSchema} from "../schemas.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"




export async function signin(req , res) {
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
            await db.collection("sessions").insertOne({ token, userID: user._id })
            res.status(200).send(token)
        } catch (err) {
        res.status(500).send(err.message)
        }
};

export async function signup(req, res) {

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
		await db.collection("usuarios").insertOne({ username, email, password: hash, balance: 0, transactions: []})
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
};

export async function signoff(req, res) {
    //logout
        const { authorization } = req.headers["authorization"];
        const token = authorization?.replace('Bearer ', '');
      
        if(!token) return res.sendStatus(401);
    
    
        try {
    
        const session = await db.collection("sessions").deleteOne({ token });      
        if (!session) res.sendStatus(404)	
    
        res.sendStatus(200);
        } catch (err) {
          res.sendStatus(401);
        }
};