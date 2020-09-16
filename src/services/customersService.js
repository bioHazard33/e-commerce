const { CustomersModel, dbSync } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");

getCustomerByID = async (customer_id) => {
    let [error, data] = await to(
        CustomersModel.findOne({
            where: {
                customer_id,
            },
        })
    );
    if (error) return { status: 500, data: null, error };

    return { status: 200, data, error: null };
};

module.exports = getCustomerByID;
