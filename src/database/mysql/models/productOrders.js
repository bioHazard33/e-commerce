const { Sequelize } = require("sequelize")

const productOrdersSchema={
    productOrders_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:Sequelize.INTEGER,
        defaultValue:1
    }
}

module.exports=productOrdersSchema