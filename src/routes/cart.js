const express = require("express");
const logger = require("../config/logger/winston");
const router = express.Router();
const cartService = require("../services/cartService");
const cartValidation=require('../config/validations/cartValidation');

router.get("/generateUniqueId", async (req, res) => {
    const result = await cartService.generateUUID();
    res.status(result.status).send({ data: result.data, error: result.error });
});

router.get('/totalAmount/:cart_id',async (req,res)=>{
    let {error,value}=cartValidation.cartIdValidation.validate({cart_id:req.params.cart_id})
    if(error){
        logger.error(`Got ${req.params.cart_id} for getting total amount of cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    const result=await cartService.getTotalAmount(value.cart_id)

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


router.post("/add",async (req,res)=>{
    let {error,value}=cartValidation.insertValidation.validate(req.body)
    if (error) {
        logger.error(`Got ${req.body} for adding product in cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await cartService.addItemToCart(value)

    res.status(result.status).send({data:result.data,error:result.error})
})

router.put('/update',async (req,res)=>{
    let {error,value}=cartValidation.insertValidation.validate(req.body)
    if (error) {
        logger.error(`Got ${req.body} for updating product in cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    const result=await cartService.updateCartWithProduct(value,null)

    res.status(result.status).send({data:result.data,error:result.error})
})

router.delete("/empty/:cart_id",async (req,res)=>{
    let {error,value}=cartValidation.cartIdValidation.validate({cart_id:req.params.cart_id})
    if(error){
        logger.error(`Got ${req.params.cart_id} for emptying cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    const result=await cartService.emptyCart(value.cart_id)

    res.status(result.status).send({data:result.data,error:result.error})
})

router.delete('/removeProduct',async (req,res)=>{
    let {error,value}=cartValidation.cartAndProductValidation.validate(req.body)
    if(error){
        logger.error(`Got ${req.body} for deleting product in cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }
    const result=await cartService.removeProduct(value)

    res.status(result.status).send({data:result.data,error:result.error}) 
})

router.delete('/delete/:cart_id',async(req,res)=>{
    let{error,value}=cartValidation.cartIdValidation.validate({cart_id:req.params.cart_id})
    if(error){
        logger.error(`Got ${req.params.cart_id} for deleting cart`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await cartService.deleteCart(value.cart_id)
    res.status(result.status).send({data:result.data,error:result.error})
})

module.exports = router;
