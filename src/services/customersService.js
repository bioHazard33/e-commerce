const { CustomersModel, dbSync } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");
const logger = require("../config/winston");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.getCustomerByID = getCustomerByID = async (customer_id) => {
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
};

module.exports.signUpCustomer = signUpCustomer = async (customer) => {
    let [err, hashedPassoword] = await to(bcrypt.hash(customer["password"], 5));

    if (!hashedPassoword) {
        logger.error("Error while generating password error : ", err);
        return { status: 500, data: null, error: "Error while generating password" };
    }

    customer["password"] = hashedPassoword;

    let [error, data] = await to(CustomersModel.create(customer));

    if (error) {
        logger.error(error);
        if (error.parent.code == "ER_DUP_ENTRY") {
            status = 400;
            error = "Email already exists";
        } else {
            status = 500;
            error = error.message;
        }
        return { status, data: null, error };
    }

    customer["customer_id"] = data.dataValues.customer_id;

    const accessToken = jwt.sign(
        { customer_id: data.dataValues.customer_id },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );
    delete customer["password"];

    let createdCustomer = { customer, accessToken, expiresIn: "12h" };
    logger.info(`Created Customer : ${JSON.stringify(createdCustomer)}`);

    return { status: 201, data: createdCustomer, error: null };
};

module.exports.updateCustomer = updateCustomer = async (customer) => {
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
};
