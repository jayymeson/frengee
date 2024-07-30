import * as Joi from "joi";

export const vehicleSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().integer().required(),
  imageUrl: Joi.string().required(),
});
