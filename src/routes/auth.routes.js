import { Router } from "express"
import { signin, signup } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { loginSchema, userSchema } from "../schemas/schemas.js"


const authRouter = Router()

authRouter.post("/cadastro", validateSchema(userSchema), signup)
authRouter.post("/", validateSchema(loginSchema), signin)


export default authRouter