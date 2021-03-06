const { Sequelize } = require("sequelize")

const ordersSchema={
    order_id:{
        type:Sequelize.UUID,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4,
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    city:{
        type:Sequelize.STRING,
        allowNull:false
    },
    postal_code:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    order_total:{
        type:Sequelize.DECIMAL(14,2),
        defaultValue:0
    }
}

module.exports=ordersSchema