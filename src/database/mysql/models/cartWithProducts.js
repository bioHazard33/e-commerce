const { Sequelize } = require("sequelize")

const cartWithProducts={
    cartWithProducts_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:Sequelize.INTEGER,
        defaultValue:1
    }
}

module.exports=cartWithProducts