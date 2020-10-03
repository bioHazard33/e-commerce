const { Sequelize } = require("sequelize")

const customerSchema={
    customer_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    address:{
        type:Sequelize.STRING,
    },
    city:{
        type:Sequelize.STRING,
    },
    postal_code:{
        type:Sequelize.STRING,
    },
    mob_phone:{
        type:Sequelize.STRING,
    },
    credit_card:{
        type:Sequelize.STRING,
    }
}

module.exports=customerSchema