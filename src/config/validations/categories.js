const Joi=require('joi')

const categoriesValidation=Joi.object({
    name:Joi.string().required(),
    description:Joi.string(),
    department_id:Joi.number()
})

module.exports=categoriesValidation