const {Sequelize,DataTypes}=require('sequelize')

const client=new Sequelize("mysql://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_IP+":3306/"+process.env.DB_NAME)
const dirname='../../models/'

const models=[
    'Customers'
]

models.forEach((model)=>{
    module.exports[model+'Model']=client.define(model,require(dirname+model))
})

const dbSync=async ()=>{
    await client.sync();
}

module.exports.dbSync=dbSync
module.exports.client=client