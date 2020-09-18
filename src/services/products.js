const logger = require("../config/logger/winston");
const { CategoriesModel, dbSync,ProductsModel  } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");

module.exports.getAllProducts=getAllProducts=async(page,limit)=>{
    logger.info(
        `Getting Products with params : page : ${page} , limit : ${limit}`
    );

    let [error, data] = await to(
        ProductsModel.findAll({
            offset: (page - 1) * 20,
            limit: limit,
            attributes:['product_id','name','description','price']
        })
    );

    if (error) {
        console.log(error)
        logger.error(error);
        return { status: 500, data: null, error: "Database Error" };
    }

    logger.debug("Successfully Get Products");
    return { status: 200, data: data, error: null };
}

module.exports.getProductById = this.getProductById = async (product_id) => {
    logger.info(`Getting product with ID=${product_id}`);

    let [error, data] = await to(
        ProductsModel.findOne({
            where: {
                product_id: product_id,
            },
        })
    );

    if (error) {
        logger.error(error);
        return { status: 500, data: null, error: "Database Error" };
    }

    if (data === null)
        return { status: 400, data: null, error: `No product with ID: ${product_id}` };

    logger.debug("Succesfully get product by ID");
    return { status: 200, data: data, error: null };
};