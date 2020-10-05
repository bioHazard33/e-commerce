const Joi = require("joi");

const reviewsValidation = {
    addValidation:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        review:Joi.string(),
        product_id:Joi.number().required(),
    }),
    updateValidation:Joi.object({
        review_id:Joi.number().required().min(1),
        rating:Joi.number().min(1).max(5).required(),
        review:Joi.string(),
        product_id:Joi.number().required().min(1),
    }),
    deleteValidation:Joi.object({
        review_id:Joi.number().required().min(1),
    }),
    productIdValidation:Joi.object({
        product_id:Joi.number().required().min(1)
    })
};

module.exports = reviewsValidation;
