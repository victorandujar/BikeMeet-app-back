import { Joi } from "express-validation";

const ridesSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    elevationGain: Joi.number().required(),
    date: Joi.string().required(),
    surfaceType: Joi.string().required(),
    distance: Joi.number().required(),
    difficulty: Joi.string().required(),
    pace: Joi.number().required(),
    description: Joi.string().max(500).required(),
    ridersJoined: Joi.array(),
    ridersLimit: Joi.number().required(),
    image: Joi.string(),
  }),
};

export default ridesSchema;
