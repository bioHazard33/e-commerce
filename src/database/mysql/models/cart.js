const { Sequelize } = require("sequelize")

const cartSchema={
    cart_id:{
        type:Sequelize.UUID,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4,
    },
    cart_total:{
        type:Sequelize.DECIMAL(14,2),
        defaultValue:0
    }
}

module.exports=cartSchema