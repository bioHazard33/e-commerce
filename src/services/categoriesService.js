const logger = require("../config/logger/winston");
const {
    CategoriesModel,
    dbSync,
    DepartmentsModel,
    ProductsModel,
} = require("../database/mysql/sequelize");
const { to } = require("await-to-js");

const categoriesService = {
    getCategories: async (sort, page, limit) => {
        logger.info(
            `Getting Categories with params : sort :${sort} , page : ${page} , limit : ${limit}`
        );
        let [error, data] = await to(
            CategoriesModel.findAll({
                order: [[sort, "ASC"]],
                offset: (page - 1) * 20,
                limit: limit,
            })
        );

        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        logger.debug("Successfully get Caetogories");
        return { status: 200, data: data, error: null };
    },

    getCategoryById: async (category_id) => {
        logger.info(`Getting category with ID=${category_id}`);

        let [error, data] = await to(
            CategoriesModel.findOne({
                where: {
                    category_id: category_id,
                },
            })
        );

        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        if (data === null)
            return { status: 400, data: null, error: `No category with ID: ${category_id}` };

        logger.debug("Succesfully get category by ID");
        return { status: 200, data: data, error: null };
    },

    getCategoriesByDepartmentId: async (department_id) => {
        logger.info(`Getting Categories in the department ${department_id}`);

        let [error, data] = await to(
            DepartmentsModel.findAll({
                where: {
                    department_id,
                },
                include: {
                    model: CategoriesModel,
                    attributes: ["category_id", "name", "description"],
                },
            })
        );
        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        if (data === null || data.length === 0)
            return { status: 400, data: null, error: `No Department with ID: ${department_id}` };

        logger.debug("Succesfully get categories by Department ID");
        return { status: 200, data: data, error: null };
    },

    getCategoryByProductId: async (product_id) => {
        logger.info(`Getting Category for the product ${product_id}`);

        let [error, data] = await to(
            ProductsModel.findOne({
                where: {
                    product_id,
                },
                attributes: ["product_id", "name"],
                include: {
                    model: CategoriesModel,
                    attributes: ["category_id", "name", "department_id"],
                },
            })
        );
        if (error) {
            console.log(error);
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        if (data === null || data.length === 0)
            return { status: 400, data: null, error: `No Product with ID: ${product_id}` };

        logger.debug("Succesfully get category by Product ID");
        return { status: 200, data: data, error: null };
    },
};

module.exports = categoriesService;
