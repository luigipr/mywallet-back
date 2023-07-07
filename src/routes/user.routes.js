import { Router } from "express"
import { validateAuth } from "../middlewares/validateAuth.js"
import { signoff, transaction, userTransactions } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { transactionSchema } from "../schemas/schemas.js";

const userRouter = Router()

userRouter.delete("/home", validateAuth, signoff);
userRouter.post("/nova-transacao/:tipo", validateAuth,validateSchema(transactionSchema), transaction)
userRouter.get("/home", validateAuth, userTransactions)


export default userRouter