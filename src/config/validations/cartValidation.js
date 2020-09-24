const Joi = require("joi");

const cartValidation = {
    insertValidation: Joi.object({
        cart_id: Joi.string().guid({ version: "uuidv4" }).required(),
        product_id: Joi.number().required().min(1),
        quantity: Joi.number().min(1).default(1)
    }),
    cartAndProductValidation:Joi.object({
        cart_id:Joi.string().guid({version:'uuidv4'}).required(),
        product_id: Joi.number().required().min(1)
    }),
    cartIdValidation:Joi.object({
        cart_id: Joi.string().guid({ version: "uuidv4" }).required(),
    })
};

module.exports = cartValidation;
