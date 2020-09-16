const express = require("express");
const router = express.Router();
const { CustomersModel, dbSync } = require("../database/mysql/sequelize");
const getCustomerByID = require("../services/customersService");
const { to } = require("await-to-js");

router.get("/", async (req, res) => {
    const customer_id = parseInt(req.body.customer_id);
    let result = await getCustomerByID(customer_id);
    res.status(result.status).send({ data: result.data, error: result.error });
});

module.exports = router;