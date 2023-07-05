import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    confirmPassword:  Joi.string().required().min(3)
})

export const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3)
})

export const transactionSchema = Joi.object({
    value: Joi.required().number().precision(2),
    description: Joi.required().string(),
    date: Joi.required().date().format('DD-MM')
})