const express = require("express");
const logger = require("../config/logger/winston");
const router = express.Router();
const cartService = require("../services/cartService");
const cartValidation=require('../config/validations/cartValidation');
const { data } = require("../config/logger/winston");

router.get("/generateUniqueId", async (req, res) => {
    const result = await cartService.generateUUID();
    res.status(result.status).send({ data: result.data, error: result.error });
});

router.post("/add",async (req,res)=>{
    let {error,value}=cartValidation.insertValidation.validate(req.body)
    if (error) {
        logger.error(`Got ${req.body} for adding product in cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await cartService.addItemToCart(value)

    res.status(result.status).send({data:result.data,error:result.error})
})

router.get("/:cart_id",async (req,res)=>{
    let {error,value}=cartValidation.cartIdValidation.validate({cart_id:req.params.cart_id})
    if (error) {
        logger.error(`Got ${req.params.cart_id} for gettings products in cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await cartService.getProductsInCart(req.params.cart_id)

    res.status(result.status).send({data:result.data,error:result.error})
})

module.exports = router;
