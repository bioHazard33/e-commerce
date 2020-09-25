const express = require("express");
const customersValidation = require("../config/validations/customers");
const customersService = require("../services/customersService");
const auth = require("../middleware/auth");
const logger = require("../config/logger/winston");

const router = express.Router();


// ** Get Customer

router.get("/", auth, async (req, res) => {
    const customer_id = parseInt(req["customer_id"]);
    let result = await customersService.getCustomerByID(customer_id);
    res.status(result.status).send({ data: result.data, error: result.error });
});

// * Signup Customer

router.post("/", async (req, res) => {
    let { error, value } = customersValidation.signupValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await customersService.signUpCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.error });
});


router.post('/login',async(req,res)=>{
    let {error,value}=customersValidation.loginValidation.validate(req.body)
    if(error){
        return res.status(400).send({data:null,error:error.details[0].message})
    }

    const result=await customersService.loginCustomer(value)

    res.status(result.status).send({ data: result.data, error: result.error });
})

// * Update Customer

router.put("/", auth, async (req, res) => {
    let { error, value } = customersValidation.signupValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await customersService.updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

// * Update Address

router.put("/address", auth, async (req, res) => {
    let { error, value } = customersValidation.addressValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await customersService.updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

// * Update Credit Card

router.put("/creditCard", auth, async (req, res) => {
    let { error, value } = customersValidation.creditCardValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    value["customer_id"] = req["customer_id"];
    const result = await customersService.updateCustomer(value);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.null });
});

module.exports = router;
