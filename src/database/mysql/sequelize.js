const {Sequelize,DataTypes}=require('sequelize')
const customerSchema = require('../../models/customers')

const client=new Sequelize("mysql://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_IP+":3306/"+process.env.DB_NAME)
const dirname='../../models/'

const models=[
    'Customers',
    'Departments',
    'Categories',
    'Products',
    'Orders',
    'ProductOrders'
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

createdModels['Orders'].belongsToMany(createdModels['Products'],{
    through:'ProductOrders',
    as:'products',
    foreignKey:'order_id',
    otherKey:'product_id'
})

createdModels['Products'].belongsToMany(createdModels['Orders'],{
    through:'ProductOrders',
    as:'orders',
    foreignKey:'product_id',
    otherKey:'order_id'
})

const dbSync=async (force)=>{
    await client.sync({force});
}

models.forEach((model)=>{
    module.exports[model+'Model']=createdModels[model]
})

module.exports.dbSync=dbSync
module.exports.client=client