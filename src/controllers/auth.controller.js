
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { db } from "../app.js";

export async function signin(req , res) {
    //sign-in
        const {email, password} = req.body
       
        try {
            const user = await db.collection("usuarios").findOne({email})
            if (!user) return res.status(404).send("Usuário não cadastrado")
    
            const correctPW = bcrypt.compareSync(password, user.password)
            if (!correctPW) return res.status(401).send("Senha incorreta")
            
            await db.collection("sessao").deleteMany({ userID: user._id })    
            const token = uuid()
            await db.collection("sessions").insertOne({ token, userID: user._id })
            res.status(200).send(token)
        } catch (err) {
        res.status(500).send(err.message)
        }
};

export async function signup(req, res) {

    const {username, email, password, password2} = req.body

    if (password !== password2) return res.status(422).send('as senhas devem ser iguais!')   

    try {
		const user = await db.collection("usuarios").findOne({ email })
		if (user) return res.status(409).send("Esse usuario já existe!")

        const hash = bcrypt.hashSync(password, 10)
		await db.collection("usuarios").insertOne({ username, email, password: hash})
        console.log(username, email)
		res.status(201).send(user)
	} catch (err) {
		res.status(500).send(err.message)
	}
};
