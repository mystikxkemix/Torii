import { RequestHandler } from "express";
import Joi from "joi";

export function validate(
  schema: Joi.Schema,
  key: "body" | "query" | "params" = "body"
) {
  const handler: RequestHandler = (req, res, next) => {
    const { error } = schema.validate(req[key]);

    if (error) {
      // Validation failed
      return res.status(500).json({ error: error.details[0].message });
    }

    next();
  };

  return handler;
}
