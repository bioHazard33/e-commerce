const { Sequelize } = require("sequelize")

const departmentSchema={
    department_id:{
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
}

module.exports=departmentSchema