const { Sequelize } = require("sequelize")

const productSchema={
    product_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
    },
    price:{
        type:Sequelize.DECIMAL(10,2),
        allowNull:false
    }
}

module.exports=productSchema