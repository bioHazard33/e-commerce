const {Sequelize,DataTypes}=require('sequelize')

const client=new Sequelize("mysql://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_IP+":3306/"+process.env.DB_NAME)
const dirname='../../models/'

const models=[
    'Customers',
    'Departments',
    'Categories',
    'Products',
    'Orders',
    'ProductOrders',
    'Cart',
    'CartWithProducts',
    'Reviews'
]

let createdModels={}

models.forEach((model)=>{
    createdModels[model]=client.define(model,require(dirname+model))
})

createdModels['Departments'].hasMany(createdModels['Categories'],{
    foreignKey:'department_id',
    onDelete: 'cascade'
})

createdModels['Categories'].hasMany(createdModels['Products'],{
    foreignKey:'category_id',
    onDelete:'cascade'
})

createdModels['Customers'].hasMany(createdModels['Orders'],{
    foreignKey:'customer_id',
    onDelete:'cascade'
})

createdModels['Products'].belongsTo(createdModels['Categories'],{
    foreignKey:'category_id',
    targetKey:'category_id',
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

createdModels['Cart'].belongsToMany(createdModels['Products'],{
    through:'CartWithProducts',
    as:'products',
    foreignKey:'cart_id',
    otherKey:'product_id'
})

createdModels['Products'].belongsToMany(createdModels['Cart'],{
    through:'CartWithProducts',
    as:'cart',
    foreignKey:'product_id',
    otherKey:'cart_id'
})

createdModels['Products'].hasMany(createdModels['Reviews'],{
    foreignKey:'product_id',
    onDelete:'cascade'
})

createdModels['Customers'].hasMany(createdModels['Reviews'],{
    foreignKey:'customer_id'
})

createdModels['Reviews'].belongsTo(createdModels['Customers'],{
    foreignKey:'customer_id'
})

const dbSync=async (force)=>{
    await client.sync({force});
}

models.forEach((model)=>{
    module.exports[model+'Model']=createdModels[model]
})

module.exports.dbSync=dbSync
module.exports.client=client