const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .min(6)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    })
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});