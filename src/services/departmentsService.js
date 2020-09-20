const logger = require("../config/logger/winston");
const { DepartmentsModel } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");

const departmentsService = {
    getAllDepartments: async () => {
        logger.info(`Getting All Departments `);

        let [error, data] = await to(
            DepartmentsModel.findAll({
                attributes: ["department_id", "name", "description"],
            })
        );

        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        logger.debug("Successfully Get Departments");
        return { status: 200, data: data, error: null };
    },

    getDepartmentsById: async (department_id) => {
        logger.info(`Getting Department by ID : ${department_id}`);

        let [error, data] = await to(
            DepartmentsModel.findOne({
                where: {
                    department_id,
                },
            })
        );
        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        if (data == null)
            return { status: 400, data: null, error: `No department with ID : ${department_id}` };

        logger.debug("Successfully Get Departments by ID");
        return { status: 200, data: data, error: null };
    },
};

module.exports=departmentsService