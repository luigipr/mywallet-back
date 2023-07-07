import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    password2:  Joi.string().min(3).required()
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
})

export const transactionSchema = Joi.object({
    value: Joi.number().precision(2).required(),
    description: Joi.string().required(),
    
})

