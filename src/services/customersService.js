const { CustomersModel, dbSync } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");
const logger = require("../config/logger/winston");
const bcrypt = require("bcrypt");

const customersService = {
    getCustomerByID: async (customer_id) => {
        let [error, data] = await to(
            CustomersModel.findOne({
                where: {
                    customer_id,
                },
            })
        );
        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }
        logger.info(`Got customer with ID: ${customer_id}`);
        logger.debug("Successfully get customer by ID");

        delete data.dataValues["password"];
        return { status: 200, data: data.dataValues, error: null };
    },

    updateCustomer: async (customer) => {
        if (customer["password"]) {
            let [err, hashedPassoword] = await to(bcrypt.hash(customer["password"], 5));

            if (!hashedPassoword) {
                logger.error("Error while generating password error in update route : ", err);
                return { status: 500, data: null, error: "Error while generating password" };
            }

            customer["password"] = hashedPassoword;
        }

        let [error, data] = await to(
            CustomersModel.update(customer, {
                where: {
                    customer_id: customer["customer_id"],
                },
            })
        );

        if (error) {
            logger.error(error);
            return {
                status: 500,
                data: null,
                error: `Error while Updating user ID = ${customer["customer_id"]}`,
            };
        }
        delete customer["password"];
        return { status: 200, data: customer, error: null };
    },

    getCustomerAddressDetails:async(customer_id)=>{
        let [error,data]=await to(CustomersModel.findOne({
            where:{
                customer_id
            },
            attributes:['customer_id','address','city','postal_code']
        }))
        if(data==null){
            return {status:400,error:`Customer with ID : ${customer_id} does not exists`}
        }
        if(error){
            logger.error(`While getting customer ${customer_id} Address , error:${error}`)
            return {status:500,data:null,error:`Server Error`}
        }
        return {status:200,data,error}
    }
};

module.exports=customersService