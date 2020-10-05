const Joi = require("joi");

const orderValidation = {
    createOrderValidation: Joi.object({
        cart_id: Joi.string().guid({ version: "uuidv4" }).required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postal_code: Joi.string().regex(/^\d+$/).length(6).required(),
        customer_id: Joi.number().required().min(1)
    }),
    orderIdValidation:Joi.object({
        order_id:Joi.string().guid({version:'uuidv4'}).required()
    })
};

module.exports = orderValidation;
