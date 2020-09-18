const {Sequelize,DataTypes}=require('sequelize')
const customerSchema = require('../../models/customers')

const client=new Sequelize("mysql://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_IP+":3306/"+process.env.DB_NAME)
const dirname='../../models/'

const models=[
    'Customers',
    'Departments',
    'Categories',
    'Products'
]

let createdModels={}

models.forEach((model)=>{
    createdModels[model]=client.define(model,require(dirname+model))
})

createdModels['Departments'].hasMany(createdModels['Categories'],{
    foreignKey:{
        name:'department_id',
        onDelete: 'cascade'
    }
})

createdModels['Categories'].hasMany(createdModels['Products'],{
    foreignKey:{
        name:'category_id',
        onDelete:'cascade'
    }
})

createdModels['Products'].belongsTo(createdModels['Categories'],{
    foreignKey:'category_id',
    targetKey:'category_id',
    constraints:true
})

const dbSync=async ()=>{
    await client.sync({force:false});
}

models.forEach((model)=>{
    module.exports[model+'Model']=createdModels[model]
})

module.exports.dbSync=dbSync
module.exports.client=client