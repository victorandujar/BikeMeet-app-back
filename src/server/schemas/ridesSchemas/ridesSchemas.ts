import { Joi } from "express-validation";

const ridesSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.string().required(),
    surfaceType: Joi.string().required(),
    distance: Joi.string().required(),
    difficulty: Joi.string().required(),
    pace: Joi.string().required(),
    description: Joi.string().max(500).required(),
    ridersJoined: Joi.string(),
    ridersLimit: Joi.number().required(),
    image: Joi.string(),
  }),
};

export default ridesSchema;
