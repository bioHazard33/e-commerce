const { to } = require("await-to-js");
const {ReviewsModel,CustomersModel}=require('../database/mysql/sequelize')
const logger = require("../config/logger/winston");

const reviewsService={
    addReview:async (review_object)=>{
        let [error,data]=await to(ReviewsModel.findOrCreate({
            where:{
                product_id:review_object.product_id,
                customer_id:review_object.customer_id
            },
            defaults:review_object
        }))

        if(error){
            logger.error(
                `Error while adding Review by ${review_object.customer_id} to Product ${review_object.product_id}, Error: ${error}`
            );
            if (error.parent && error.parent.code === "ER_NO_REFERENCED_ROW_2") {
                return {
                    status: 400,
                    data: null,
                    error: `Product with ID : ${review_object.product_id} or Customer with ID ${review_object.customer_id} does not exists`,
                };
            }
            return { data: null, error: "Server Error" };
        }

        if(data[1] === false){
            logger.info(`Customer with ID : ${review_object.customer_id} has already reviewed product with ID : ${review_object.product_id}`)
            return {status:400,data:null,error:`You have already reviewed product ${review_object.product_id} , you can edit it`}
        }

        logger.info(`Successfully posted review with ID : ${data[0].dataValues.review_id}`);
        return {status:201,data:`Successfully posted your review`,error:null};
    },

    getReviews:async (product_id)=>{
        let [error,data]=await to(ReviewsModel.findAll({
            where:{
                product_id
            },
            attributes:['rating','review'],
            include:{
                model:CustomersModel,
                attributes:['customer_id','name']
            }
        }))

        if(error){
            logger.error(`While getting reviews for product with ID : ${product_id} , Error : ${error}`)
            return {status:500,data:null,error:`Server Error`}
        }

        if(data.length==0 || data==[] || data==null){
            logger.error(`No reviews found for product ID : ${product_id}`)
            return {status:404,data:null,error:`No reviews found for product with ID : ${product_id}`}
        }

        logger.info(`Successfully get reviews for produt with ID : ${product_id}`)
        return {status:200,data,error}
    },

    updateReview:async(review_id,customer_id,product_id,update_object)=>{
        let [error,data]=await to(ReviewsModel.update(update_object,{
            where:{
                review_id,
                customer_id,
                product_id
            }
        }))
        if(error){
            logger.error(`Error while updating review ${review_id} on product ${product_id}`)
            return {status:500,data:null,error:`Server Error`}
        }
        if(data[0]==0){
            logger.error(`Customer ${customer_id} has not reviewed product with id ${product_id}`)
            return {status:400,data:null,error:`You have not reviewed the product with ID ${product_id}`}
        }
        return {status:200,data:`Successfully updated your review`,error}
    },

    deleteReview:async (review_id,customer_id)=>{
        let [error,data]=await to(ReviewsModel.destroy({
            where:{
                review_id,
                customer_id
            }
        }))
        console.log(data)
        if(error){
            logger.error(`Error while deleting review ${review_id} by customer ${customer_id}`)
            return {status:500,data:null,error:`Server Error`}
        }
        if(data===0){
            logger.error(`Customer ${customer_id} has not reviewed review with ID ${review_id}`)
            return {status:404,data:null,error:`No review found with ID: ${review_id}`}
        }

        return {status:200,data:`Successfully deleted your review`,error}
    }
}

module.exports=reviewsService