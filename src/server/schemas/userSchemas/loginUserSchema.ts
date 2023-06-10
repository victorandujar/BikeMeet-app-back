import { Joi } from "express-validation";

const loginUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export default loginUserSchema;
