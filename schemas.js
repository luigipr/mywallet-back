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