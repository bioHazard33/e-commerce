const Joi = require("joi");

const customersValidation = {
    signupValidation: Joi.object({
        name: Joi.string(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().min(6).required(),
        address: Joi.string(),
        city: Joi.string(),
        postal_code: Joi.string().regex(/^\d+$/).length(6),
        mob_phone: Joi.string().regex(/^\d+$/).length(10),
        credit_card: Joi.string().regex(/^\d+$/).length(12),
    }),

    loginValidation: Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().min(6).required(),
    }),

    addressValidation: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        postal_code: Joi.string().regex(/^\d+$/).length(6).required(),
    }),

    creditCardValidation: Joi.object({
        credit_card: Joi.string().regex(/^\d+$/).length(12).required(),
    }),
};

module.exports = customersValidation;
