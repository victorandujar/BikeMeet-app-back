import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isVerified: Joi.boolean(),
    confirmationCode: Joi.string(),
  }),
};

export default registerUserSchema;
