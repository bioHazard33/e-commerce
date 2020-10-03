const { Sequelize } = require("sequelize")

const reviewsSchema={
    review_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    rating:{
        type:Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 5
        },
        allowNull:false
    },
    review:{
        type:Sequelize.STRING,
        allowNull:true
    }
}

module.exports=reviewsSchema