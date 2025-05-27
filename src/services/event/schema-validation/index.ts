import Joi, { date } from "joi";

/** Joi Validation Schema for a new Event data */
export const NewEventSchema = Joi.object({
  title: Joi.string().trim().required(),

  description: Joi.string().required(),

  date: Joi.date().required(),

  capacity: Joi.number().required(),
}).required();

/** Joi Validation Schema for updating Event data */
export const UpdateEventSchema = Joi.object({
  title: Joi.string().trim(),

  description: Joi.string(),

  date: Joi.date(),

  capacity: Joi.number(),
});
