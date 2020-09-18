const express = require("express");
const router = express.Router();
const {
    customersValidation,
    addressValidation,
    creditCardValidation
} = require("../config/validations/customers");
const { 
	getCustomerByID,
	signUpCustomer,
	updateCustomer,
 } = require("../services/customersService");
const auth = require("../middleware/auth");

// ** Get Customer

router.get("/", auth, async (req, res) => {
    const customer_id = parseInt(req["customer_id"]);
    let result = await getCustomerByID(customer_id);
    res.status(result.status).send({ data: result.data, error: result.error });
});

// * Signup Customer

router.post("/", async (req, res) => {
    let { error, value } = customersValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await signUpCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.error });
});

// * Update Customer

router.put("/", auth, async (req, res) => {
    let { error, value } = customersValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

// * Update Address

router.put("/address", auth, async (req, res) => {
    let { error, value } = addressValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

// * Update Credit Card

router.put("/creditCard", auth, async (req, res) => {
    let { error, value } = creditCardValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

module.exports = router;
