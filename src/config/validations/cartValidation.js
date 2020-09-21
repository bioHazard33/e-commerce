const Joi = require("joi");

const cartValidation = {
    insertValidation: Joi.object({
        cart_id: Joi.string().guid({ version: "uuidv4" }).required(),
        product_id: Joi.number().required(),
    }),
    cartIdValidation:Joi.object({
        cart_id: Joi.string().guid({ version: "uuidv4" }).required(),
    })
};

module.exports = cartValidation;
