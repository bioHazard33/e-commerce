const Joi=require('joi')

const customersValidation=Joi.object({
    name:Joi.string(),
    email:Joi.string.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:Joi.string().min(6).required(),
    address:Joi.string(),
    city:Joi.string(),
    postal_code:Joi.string().length(6),
    mob_phone:Joi.string().length(10),
    credit_card:Joi.string().length(12)
})