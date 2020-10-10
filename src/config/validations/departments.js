const Joi=require('joi')

const departmentsValidation=Joi.object({
    name:Joi.string().required(),
    description:Joi.string()
})

module.exports=departmentsValidation