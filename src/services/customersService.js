const { CustomersModel, dbSync } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");
const logger = require('../config/winston')

getCustomerByID = async (customer_id) => {
    let [error, data] = await to(
        CustomersModel.findOne({
            where: {
                customer_id,
            },
        })
    );
    if (error){
        logger.error(error)
        return { status: 500, data: null, error: "Database Error" };
    }
    logger.info(`Got customer with ID: ${customer_id}`)
    logger.debug('Successfully get customer by ID');
    return { status: 200, data, error: null };
};

module.exports = getCustomerByID;
